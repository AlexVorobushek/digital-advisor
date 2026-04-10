package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.ChronicleEntry;
import ru.digital.advisor.repository.ChronicleEntryRepository;
import java.util.List;

@RestController
@RequestMapping("/api/chronicle")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChronicleController extends BaseController {
    @Autowired
    private ChronicleEntryRepository repository;

    @GetMapping
    public java.util.Map<String, Object> getAll() {
        List<ChronicleEntry> entries = repository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", entries != null ? entries : new java.util.ArrayList<>());
        response.put("count", entries != null ? entries.size() : 0);
        return response;
    }

    @PostMapping
    public ChronicleEntry create(@RequestBody ChronicleEntry item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
