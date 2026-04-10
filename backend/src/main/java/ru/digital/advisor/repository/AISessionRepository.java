package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.AISession;
import java.util.List;

@Repository
public interface AISessionRepository extends JpaRepository<AISession, Long> {
    List<AISession> findAllByUserId(Long userId);
}
