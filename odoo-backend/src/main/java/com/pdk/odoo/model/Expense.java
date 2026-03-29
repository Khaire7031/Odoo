package com.pdk.odoo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // FK → users.id

    private BigDecimal amount; // Original amount (employee's currency)
    private String currency; // Employee's chosen currency e.g. "USD"

    private BigDecimal convertedAmount; // Converted to company base currency
    private String companyCurrency; // Company's currency code e.g. "INR"
    private BigDecimal exchangeRate; // Rate used at time of submission e.g. 94.77

    private String category;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date date; // Expense date (user selected)

    private String receiptPath; // "uploads/receipts/filename.pdf"

    private String status; // PENDING, APPROVED, REJECTED

    private Integer currentApprovalStep; // tracks active step in approval chain

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
