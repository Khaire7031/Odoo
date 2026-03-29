package com.pdk.odoo.repository;

import com.pdk.odoo.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<Expense> findByUserIdOrderByCreatedAtDesc(Long userId);
}
