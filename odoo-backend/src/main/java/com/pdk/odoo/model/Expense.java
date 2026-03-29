package com.pdk.odoo.model;

import jakarta.persistence.*;
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

    private Long companyId;
    private Long userId;
    private String employeeName;
    private String employeeEmail;
    private String autoApproveReason;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    private java.util.List<ExpenseApprovalStep> approvalSteps;

    private BigDecimal amount;
    private String currency;

    private BigDecimal convertedAmount;
    private String companyCurrency;
    private BigDecimal exchangeRate;

    private String category;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date date;

    private String receiptPath;

    private String status;

    private Integer currentApprovalStep;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
