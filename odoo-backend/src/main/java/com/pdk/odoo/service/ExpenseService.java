package com.pdk.odoo.service;

import com.pdk.odoo.dto.*;
import com.pdk.odoo.model.*;
import com.pdk.odoo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CompanyConfigRepository companyConfigRepository;
    private final UserRepository userRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long companyId = user.getCompanyId();
        CompanyConfig config = companyConfigRepository.findByCompanyId(companyId).orElse(null);
        String baseCurr = config != null && config.getBaseCurrency() != null ? config.getBaseCurrency() : "USD";

        BigDecimal amount = request.getAmount();
        String currency = request.getCurrency();
        BigDecimal convertedAmount = request.getConvertedAmount();

        if (currency != null && !currency.equals(baseCurr) && (convertedAmount == null || convertedAmount.compareTo(BigDecimal.ZERO) == 0)) {
            try {
                String url = "https://api.exchangerate-api.com/v4/latest/" + baseCurr;
                com.fasterxml.jackson.databind.JsonNode response = restTemplate.getForObject(url, com.fasterxml.jackson.databind.JsonNode.class);
                if (response != null && response.has("rates")) {
                    double rate = response.get("rates").get(currency).asDouble();
                    if (rate > 0) {
                        convertedAmount = amount.divide(BigDecimal.valueOf(rate), 2, java.math.RoundingMode.HALF_UP);
                    }
                }
            } catch (Exception e) {
                // Fallback or log error
            }
        } else if (currency != null && currency.equals(baseCurr)) {
            convertedAmount = amount;
        }

        Date parsedDate = new Date();
        try {
            if (request.getDate() != null && !request.getDate().isEmpty()) {
                parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(request.getDate());
            }
        } catch (Exception e) {}

        Expense expense = Expense.builder()
                .companyId(companyId)
                .userId(user.getId())
                .employeeName(user.getFullName())
                .employeeEmail(user.getEmail())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .convertedAmount(convertedAmount)
                .companyCurrency(baseCurr)
                .category(request.getCategory())
                .description(request.getDescription())
                .date(parsedDate)
                .status("waiting")
                .createdAt(new Date())
                .updatedAt(new Date())
                .approvalSteps(new ArrayList<>())
                .build();

        if (config != null && config.getApprovalSequence() != null && !config.getApprovalSequence().isEmpty()) {
            for (int i = 0; i < config.getApprovalSequence().size(); i++) {
                ApprovalSequenceStepTemplate tpl = config.getApprovalSequence().get(i);
                ExpenseApprovalStep step = ExpenseApprovalStep.builder()
                        .expense(expense)
                        .stepNumber(tpl.getStepNumber())
                        .approverRole(tpl.getRole())
                        .approverId(tpl.getApproverId())
                        .approverName(tpl.getApproverName())
                        .status(i == 0 ? "pending" : "waiting")
                        .build();
                expense.getApprovalSteps().add(step);
            }
        }

        if (expense.getApprovalSteps().isEmpty()) {
            expense.setStatus("auto_approved");
            expense.setAutoApproveReason("No approval steps configured globally.");
        }

        Expense saved = expenseRepository.save(expense);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getCompanyExpenses(Long companyId) {
        return expenseRepository.findByCompanyIdOrderByCreatedAtDesc(companyId)
                .stream().map(ExpenseService::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getUserExpenses(Long userId) {
        return expenseRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(ExpenseService::mapToDto).collect(Collectors.toList());
    }

    public static ExpenseResponse mapToDto(Expense e) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return ExpenseResponse.builder()
                .id("EXP-" + String.format("%05d", e.getId()))
                .rawId(e.getId())
                .employeeName(e.getEmployeeName())
                .employeeEmail(e.getEmployeeEmail())
                .amount(e.getAmount())
                .currency(e.getCurrency())
                .convertedAmount(e.getConvertedAmount())
                .baseCurrency(e.getCompanyCurrency())
                .category(e.getCategory())
                .description(e.getDescription())
                .date(e.getDate() != null ? sdf.format(e.getDate()) : null)
                .status(e.getStatus())
                .autoApproveReason(e.getAutoApproveReason())
                .approvalSteps(e.getApprovalSteps() == null ? new ArrayList<>() :
                        e.getApprovalSteps().stream().map(s -> 
                            ExpenseApprovalStepDto.builder()
                                    .stepNumber(s.getStepNumber())
                                    .role(s.getApproverRole())
                                    .approverRole(s.getApproverRole())
                                    .approverId(s.getApproverId())
                                    .approverName(s.getApproverName())
                                    .status(s.getStatus())
                                    .comment(s.getComment())
                                    .actionDate(s.getActionDate() != null ? sdf.format(s.getActionDate()) : null)
                                    .build()
                        ).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void deleteExpense(Long expenseId) {
        expenseRepository.deleteById(expenseId);
    }
}
