package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.AuthenticRole;
import ru.digital.advisor.entity.User;
import ru.digital.advisor.repository.AuthenticRoleRepository;
import ru.digital.advisor.repository.UserRepository;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoleController extends BaseController {
    @Autowired
    private AuthenticRoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<AuthenticRole> getAll() {
        return roleRepository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public AuthenticRole create(@RequestBody AuthenticRole role) {
        Long userId = getCurrentUserId();
        role.setUserId(userId);
        
        Integer oldScore = 0;
        if (role.getId() != null) {
            Optional<AuthenticRole> existing = roleRepository.findById(role.getId());
            if (existing.isPresent()) {
                oldScore = existing.get().getScore();
            }
        }
        
        AuthenticRole savedRole = roleRepository.save(role);
        
        // Update user total points
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalPoints(user.getTotalPoints() - oldScore + savedRole.getScore());
            user.setLevel(user.getTotalPoints() / 400 + 1);
            userRepository.save(user);
        }
        
        return savedRole;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Optional<AuthenticRole> roleOpt = roleRepository.findById(id);
        if (roleOpt.isPresent()) {
            AuthenticRole role = roleOpt.get();
            Long userId = getCurrentUserId();
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setTotalPoints(user.getTotalPoints() - role.getScore());
                user.setLevel(user.getTotalPoints() / 400 + 1);
                userRepository.save(user);
            }
            roleRepository.deleteById(id);
        }
    }
}
