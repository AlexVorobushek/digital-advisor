package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.AuthenticRole;
import ru.digital.advisor.entity.RoleEvent;
import ru.digital.advisor.entity.User;
import ru.digital.advisor.entity.Victory;
import ru.digital.advisor.entity.ChronicleEntry;
import ru.digital.advisor.repository.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController extends BaseController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthenticRoleRepository roleRepository;
    
    @Autowired
    private VictoryRepository victoryRepository;

    @Autowired
    private ChronicleEntryRepository chronicleRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        Long userId = getCurrentUserId();
        Map<String, Object> metrics = new HashMap<>();
        
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            metrics.put("totalEnergy", user.get().getTotalPoints());
            metrics.put("level", user.get().getLevel());
            metrics.put("name", user.get().getName());
        }
        
        List<AuthenticRole> roles = roleRepository.findAllByUserId(userId);
        List<Victory> victories = victoryRepository.findAllByUserId(userId);
        List<ChronicleEntry> chronicle = chronicleRepository.findAllByUserId(userId);
        
        metrics.put("activeRoles", (int) roles.stream().filter(r -> r.getScore() > 0).count());
        metrics.put("totalVictories", victories.size());
        
        // --- REAL CALCULATIONS ---
        metrics.put("streak", calculateStreak(victories, chronicle, roles));
        metrics.put("weeklyEnergy", calculateWeeklyEnergy(victories, roles));
        metrics.put("monthlyProgress", calculateMonthlyProgress(victories, roles));
        
        return metrics;
    }

    private int calculateStreak(List<Victory> victories, List<ChronicleEntry> chronicle, List<AuthenticRole> roles) {
        Set<LocalDate> activeDates = new HashSet<>();
        
        victories.forEach(v -> tryParseDate(v.getDate()).ifPresent(activeDates::add));
        chronicle.forEach(c -> tryParseDate(c.getDate()).ifPresent(activeDates::add));
        roles.forEach(r -> {
            if (r.getEvents() != null) {
                r.getEvents().forEach(e -> tryParseDate(e.getDate()).ifPresent(activeDates::add));
            }
        });

        if (activeDates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        int streak = 0;
        
        // Start from today or yesterday
        LocalDate current = today;
        if (!activeDates.contains(today)) {
            current = today.minusDays(1);
        }

        while (activeDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return streak;
    }

    private List<Map<String, Object>> calculateWeeklyEnergy(List<Victory> victories, List<AuthenticRole> roles) {
        String[] dayLabels = {"Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"};
        Map<LocalDate, Integer> dailyPoints = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            dailyPoints.put(today.minusDays(i), 0);
        }

        // Sum Victory points
        victories.forEach(v -> tryParseDate(v.getDate()).ifPresent(date -> {
            if (dailyPoints.containsKey(date)) {
                dailyPoints.put(date, dailyPoints.get(date) + v.getScore());
            }
        }));

        // Sum Role Event points
        roles.forEach(r -> {
            if (r.getEvents() != null) {
                r.getEvents().forEach(e -> tryParseDate(e.getDate()).ifPresent(date -> {
                    if (dailyPoints.containsKey(date)) {
                        dailyPoints.put(date, dailyPoints.get(date) + e.getScore());
                    }
                }));
            }
        });

        List<Map<String, Object>> result = new ArrayList<>();
        // Return last 7 days sorted correctly
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            Map<String, Object> entry = new HashMap<>();
            // Get label based on day of week
            int dayOfWeek = d.getDayOfWeek().getValue(); // 1-7 (Mon-Sun)
            entry.put("day", dayLabels[dayOfWeek - 1]);
            entry.put("energy", dailyPoints.get(d));
            result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> calculateMonthlyProgress(List<Victory> victories, List<AuthenticRole> roles) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 3; i >= 0; i--) {
            LocalDate weekEnd = today.minusDays(i * 7L);
            LocalDate weekStart = weekEnd.minusDays(6);
            
            int personalPoints = 0; // Role Events
            int activityPoints = 0; // Victories

            for (Victory v : victories) {
                Optional<LocalDate> vd = tryParseDate(v.getDate());
                if (vd.isPresent() && !vd.get().isBefore(weekStart) && !vd.get().isAfter(weekEnd)) {
                    activityPoints += v.getScore();
                }
            }

            for (AuthenticRole r : roles) {
                if (r.getEvents() != null) {
                    for (RoleEvent e : r.getEvents()) {
                        Optional<LocalDate> ed = tryParseDate(e.getDate());
                        if (ed.isPresent() && !ed.get().isBefore(weekStart) && !ed.get().isAfter(weekEnd)) {
                            personalPoints += e.getScore();
                        }
                    }
                }
            }

            Map<String, Object> entry = new HashMap<>();
            entry.put("week", "Нед " + (4 - i));
            // Scaling points for visualization (0-100)
            entry.put("personal", Math.min(100, personalPoints * 2)); 
            entry.put("activity", Math.min(100, activityPoints * 2));
            data.add(entry);
        }
        return data;
    }

    private Optional<LocalDate> tryParseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) return Optional.empty();
        try {
            // Support both YYYY-MM-DD and maybe other formats if they leak in
            if (dateStr.length() > 10) dateStr = dateStr.substring(0, 10);
            return Optional.of(LocalDate.parse(dateStr, DATE_FORMATTER));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
