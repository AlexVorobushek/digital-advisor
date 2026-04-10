package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.ChronicleEntry;
import java.util.List;

@Repository
public interface ChronicleEntryRepository extends JpaRepository<ChronicleEntry, Long> {
    List<ChronicleEntry> findAllByUserId(Long userId);
}
