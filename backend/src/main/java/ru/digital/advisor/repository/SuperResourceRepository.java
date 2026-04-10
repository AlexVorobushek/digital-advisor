package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.SuperResource;
import java.util.List;

@Repository
public interface SuperResourceRepository extends JpaRepository<SuperResource, Long> {
    List<SuperResource> findAllByUserId(Long userId);
}
