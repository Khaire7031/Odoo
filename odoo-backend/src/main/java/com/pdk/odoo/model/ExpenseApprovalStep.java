package com.pdk.odoo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "expense_approval_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseApprovalStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id")
    private Expense expense;

    private Integer stepNumber;
    private String approverRole;
    private Long approverId;
    private String approverName;

    private String status; // pending, waiting, approved, rejected, skipped
    private String comment;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date actionDate;
}
