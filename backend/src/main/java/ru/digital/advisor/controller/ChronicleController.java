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
    public List<ChronicleEntry> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
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
