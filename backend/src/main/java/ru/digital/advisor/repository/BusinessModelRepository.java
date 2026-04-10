package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.BusinessModel;
import java.util.List;

@Repository
public interface BusinessModelRepository extends JpaRepository<BusinessModel, Long> {
    List<BusinessModel> findAllByUserId(Long userId);
}
