package com.pdk.odoo.repository;

import com.pdk.odoo.model.ExpenseApprovalStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseApprovalStepRepository extends JpaRepository<ExpenseApprovalStep, Long> {
    List<ExpenseApprovalStep> findByApproverIdAndStatus(Long approverId, String status);
    List<ExpenseApprovalStep> findByApproverRoleAndStatus(String approverRole, String status);
}
