package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.MetaTest;
import ru.digital.advisor.repository.MetaTestRepository;
import java.util.List;

@RestController
@RequestMapping("/api/metatests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MetaTestController extends BaseController {
    @Autowired
    private MetaTestRepository repository;

    @GetMapping
    public java.util.Map<String, Object> getAll() {
        List<MetaTest> items = repository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", items != null ? items : new java.util.ArrayList<>());
        response.put("count", items != null ? items.size() : 0);
        return response;
    }

    @PostMapping
    public MetaTest create(@RequestBody MetaTest item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
