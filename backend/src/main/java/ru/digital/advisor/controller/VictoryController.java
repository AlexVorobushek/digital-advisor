package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.Victory;
import ru.digital.advisor.entity.User;
import ru.digital.advisor.entity.AuthenticRole;
import ru.digital.advisor.repository.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/victories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VictoryController extends BaseController {
    @Autowired
    private VictoryRepository victoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthenticRoleRepository roleRepository;

    @GetMapping
    public java.util.Map<String, Object> getAll() {
        List<Victory> victories = victoryRepository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", victories != null ? victories : new java.util.ArrayList<>());
        response.put("count", victories != null ? victories.size() : 0);
        return response;
    }

    @PostMapping
    public Victory create(@RequestBody Victory victory) {
        Long userId = getCurrentUserId();
        victory.setUserId(userId);
        
        boolean isNew = victory.getId() == null;
        Integer oldScore = 0;
        
        if (!isNew) {
            Optional<Victory> existing = victoryRepository.findById(victory.getId());
            if (existing.isPresent()) {
                oldScore = existing.get().getScore();
            }
        }
        
        Victory savedVictory = victoryRepository.save(victory);
        
        // Update user total points
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalPoints(user.getTotalPoints() - oldScore + savedVictory.getScore());
            // Basic leveling logic: level = points / 400 + 1
            user.setLevel(user.getTotalPoints() / 400 + 1);
            userRepository.save(user);
        }
        
        // Update linked role score if present
        if (savedVictory.getLinkedRole() != null) {
            final Integer scoreToAdjust = oldScore;
            List<AuthenticRole> roles = roleRepository.findAllByUserId(userId);
            roles.stream()
                .filter(r -> r.getName().equals(savedVictory.getLinkedRole()))
                .findFirst()
                .ifPresent(role -> {
                    role.setScore(Math.min(100, role.getScore() - scoreToAdjust + savedVictory.getScore()));
                    role.setLastActive(savedVictory.getDate());
                    roleRepository.save(role);
                });
        }
        
        return savedVictory;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Optional<Victory> victoryOpt = victoryRepository.findById(id);
        if (victoryOpt.isPresent()) {
            Victory victory = victoryOpt.get();
            Long userId = getCurrentUserId();
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setTotalPoints(user.getTotalPoints() - victory.getScore());
                user.setLevel(user.getTotalPoints() / 400 + 1);
                userRepository.save(user);
            }
            
            if (victory.getLinkedRole() != null) {
                List<AuthenticRole> roles = roleRepository.findAllByUserId(userId);
                roles.stream()
                    .filter(r -> r.getName().equals(victory.getLinkedRole()))
                    .findFirst()
                    .ifPresent(role -> {
                        role.setScore(Math.max(0, role.getScore() - victory.getScore()));
                        roleRepository.save(role);
                    });
            }
            victoryRepository.deleteById(id);
        }
    }
}
