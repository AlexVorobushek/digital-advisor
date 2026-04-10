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
    public java.util.Map<String, Object> getAll() {
        List<BusinessModel> items = repository.findAllByUserId(getCurrentUserId());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("items", items != null ? items : new java.util.ArrayList<>());
        response.put("count", items != null ? items.size() : 0);
        return response;
    }

    @PostMapping
    public BusinessModel create(@RequestBody BusinessModel item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }
}
