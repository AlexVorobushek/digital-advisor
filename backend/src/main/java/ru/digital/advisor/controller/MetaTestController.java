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
    public List<MetaTest> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public MetaTest create(@RequestBody MetaTest item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
