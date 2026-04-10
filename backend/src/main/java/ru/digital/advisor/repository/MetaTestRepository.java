package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.MetaTest;
import java.util.List;

@Repository
public interface MetaTestRepository extends JpaRepository<MetaTest, Long> {
    List<MetaTest> findAllByUserId(Long userId);
}
