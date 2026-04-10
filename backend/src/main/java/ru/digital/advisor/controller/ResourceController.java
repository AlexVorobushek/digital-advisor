package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.SuperResource;
import ru.digital.advisor.repository.SuperResourceRepository;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResourceController extends BaseController {
    @Autowired
    private SuperResourceRepository repository;

    @GetMapping
    public List<SuperResource> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public SuperResource create(@RequestBody SuperResource item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
