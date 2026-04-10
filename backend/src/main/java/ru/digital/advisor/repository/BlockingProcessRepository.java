package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.BlockingProcess;
import java.util.List;

@Repository
public interface BlockingProcessRepository extends JpaRepository<BlockingProcess, Long> {
    List<BlockingProcess> findAllByUserId(Long userId);
}
