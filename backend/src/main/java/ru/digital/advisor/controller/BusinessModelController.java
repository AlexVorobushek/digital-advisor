package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.BusinessModel;
import ru.digital.advisor.repository.BusinessModelRepository;
import java.util.List;

@RestController
@RequestMapping("/api/business-models")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BusinessModelController extends BaseController {
    @Autowired
    private BusinessModelRepository repository;

    @GetMapping
    public List<BusinessModel> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public BusinessModel create(@RequestBody BusinessModel item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
