package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.Focus;
import ru.digital.advisor.repository.FocusRepository;
import java.util.List;

@RestController
@RequestMapping("/api/focuses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FocusController extends BaseController {
    @Autowired
    private FocusRepository repository;

    @GetMapping
    public java.util.Map<String, Object> getAll() {
        List<Focus> focuses = repository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", focuses != null ? focuses : new java.util.ArrayList<>());
        response.put("count", focuses != null ? focuses.size() : 0);
        return response;
    }

    @PostMapping
    public Focus create(@RequestBody Focus item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
