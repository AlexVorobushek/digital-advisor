package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.Reflection;
import java.util.List;

@Repository
public interface ReflectionRepository extends JpaRepository<Reflection, Long> {
    List<Reflection> findAllByUserId(Long userId);
}
