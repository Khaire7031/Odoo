package com.pdk.odoo.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pdk.odoo.model.Expense;

@Service
public class ExpenseService {

    public List<Expense> getAllExpenses(String id) {
        Expense expense = Expense.builder()
                .id(1L)
                .userId(123L)
                .amount(new java.math.BigDecimal("100.00"))
                .currency("USD")
                .convertedAmount(new java.math.BigDecimal("7500.00"))
                .companyCurrency("INR")
                .exchangeRate(new java.math.BigDecimal("75.00"))
                .category("Travel")
                .description("Flight ticket to Mumbai")
                .date(new java.util.Date())
                .receiptPath("uploads/receipts/flight_ticket.pdf")
                .status("PENDING")
                .currentApprovalStep(1)
                .createdAt(new java.util.Date())
                .updatedAt(new java.util.Date())
                .build();
        return Arrays.asList(expense);
    }
}
