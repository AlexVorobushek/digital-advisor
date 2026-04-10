package ru.digital.advisor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.digital.advisor.entity.BlockingProcess;
import ru.digital.advisor.repository.BlockingProcessRepository;
import java.util.List;

@RestController
@RequestMapping("/api/blocking")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlockingController extends BaseController {
    @Autowired
    private BlockingProcessRepository repository;

    @GetMapping
    public List<BlockingProcess> getAll() {
        return repository.findAllByUserId(getCurrentUserId());
    }

    @PostMapping
    public BlockingProcess create(@RequestBody BlockingProcess item) {
        item.setUserId(getCurrentUserId());
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
