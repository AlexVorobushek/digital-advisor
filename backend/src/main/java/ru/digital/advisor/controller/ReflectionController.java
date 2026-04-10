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
    public List<Reflection> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public Reflection create(@RequestBody Reflection item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
