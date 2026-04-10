package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.Reflection;
import ru.digital.advisor.repository.ReflectionRepository;
import java.util.List;

@RestController
@RequestMapping("/api/reflections")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReflectionController extends BaseController {
    @Autowired
    private ReflectionRepository repository;

    @GetMapping
    public java.util.Map<String, Object> getAll() {
        List<Reflection> items = repository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", items != null ? items : new java.util.ArrayList<>());
        response.put("count", items != null ? items.size() : 0);
        return response;
    }

    @PostMapping
    public Reflection create(@RequestBody Reflection item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
