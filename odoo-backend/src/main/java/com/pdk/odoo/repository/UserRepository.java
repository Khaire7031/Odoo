package com.pdk.odoo.repository;

import com.pdk.odoo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.pdk.odoo.model.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findByCompanyIdAndRole(Long companyId, Role role);
    java.util.Optional<User> findByUsernameAndRole(String username, Role role);
}
