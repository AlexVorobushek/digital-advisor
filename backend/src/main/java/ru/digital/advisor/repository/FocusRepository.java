package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.Focus;
import java.util.List;

@Repository
public interface FocusRepository extends JpaRepository<Focus, Long> {
    List<Focus> findAllByUserId(Long userId);
}
