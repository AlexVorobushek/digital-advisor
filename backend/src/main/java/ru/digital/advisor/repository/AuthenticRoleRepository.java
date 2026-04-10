package ru.digital.advisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.digital.advisor.entity.AuthenticRole;
import java.util.List;

@Repository
public interface AuthenticRoleRepository extends JpaRepository<AuthenticRole, Long> {
    List<AuthenticRole> findAllByUserId(Long userId);
}
