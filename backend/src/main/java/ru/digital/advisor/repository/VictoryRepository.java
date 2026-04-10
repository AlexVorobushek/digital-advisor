package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.Victory;
import java.util.List;

@Repository
public interface VictoryRepository extends JpaRepository<Victory, Long> {
    List<Victory> findAllByUserId(Long userId);
}
