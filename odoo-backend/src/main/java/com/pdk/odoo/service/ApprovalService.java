package com.pdk.odoo.service;

import com.pdk.odoo.dto.*;
import com.pdk.odoo.model.*;
import com.pdk.odoo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseApprovalStepRepository stepRepository;
    private final CompanyConfigRepository configRepository;

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getPendingForApprover(Long approverId) {
        List<ExpenseApprovalStep> pendingSteps = stepRepository.findByApproverIdAndStatus(approverId, "pending");
        return pendingSteps.stream()
                .map(s -> ExpenseService.mapToDto(s.getExpense()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void processAction(Long rawId, ApprovalActionRequest request) {
        Expense expense = expenseRepository.findById(rawId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        ExpenseApprovalStep currentStep = expense.getApprovalSteps().stream()
                .filter(s -> s.getStatus().equals("pending") && s.getApproverId().equals(request.getApproverId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No pending step found for this approver."));

        currentStep.setStatus(request.getAction().equals("approve") ? "approved" : "rejected");
        currentStep.setComment(request.getComment());
        currentStep.setActionDate(new Date());

        if (currentStep.getStatus().equals("rejected")) {
            expense.setStatus("rejected");
            expense.getApprovalSteps().stream()
                    .filter(s -> s.getStatus().equals("waiting"))
                    .forEach(s -> s.setStatus("skipped"));
            expenseRepository.save(expense);
            return;
        }

        CompanyConfig config = configRepository.findByCompanyId(expense.getCompanyId()).orElse(null);
        if (config != null) {
            String ruleType = config.getApprovalRuleType() == null ? "percentage" : config.getApprovalRuleType();
            boolean forceApprove = false;
            String reason = null;

            long approvedCount = expense.getApprovalSteps().stream().filter(s -> s.getStatus().equals("approved")).count();
            int totalSteps = expense.getApprovalSteps().size();
            double pct = (double) approvedCount / totalSteps * 100;

            if ("percentage".equals(ruleType) || "hybrid".equals(ruleType)) {
                if (config.getRuleMinPercentage() != null && pct >= config.getRuleMinPercentage()) {
                    forceApprove = true;
                    reason = "Auto-approved due to reaching " + config.getRuleMinPercentage() + "% threshold.";
                }
            }
            if (!forceApprove && ("specific_approver".equals(ruleType) || "hybrid".equals(ruleType))) {
                if (config.getRuleSpecificApproverId() != null && config.getRuleSpecificApproverId().equals(request.getApproverId())) {
                    forceApprove = true;
                    reason = "Auto-approved because specific approver (" + config.getRuleSpecificApproverName() + ") approved.";
                }
            }

            if (forceApprove) {
                expense.setStatus("auto_approved");
                expense.setAutoApproveReason(reason);
                expense.getApprovalSteps().stream()
                        .filter(s -> s.getStatus().equals("waiting") || s.getStatus().equals("pending"))
                        .forEach(s -> s.setStatus("skipped"));
                expenseRepository.save(expense);
                return;
            }
        }

        ExpenseApprovalStep nextStep = expense.getApprovalSteps().stream()
                .filter(s -> s.getStatus().equals("waiting"))
                .min((s1, s2) -> s1.getStepNumber().compareTo(s2.getStepNumber()))
                .orElse(null);

        if (nextStep != null) {
            nextStep.setStatus("pending");
        } else {
            expense.setStatus("approved");
        }

        expenseRepository.save(expense);
    }
}
