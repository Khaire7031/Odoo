package com.pdk.odoo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseApprovalStepDto {
    private Integer stepNumber;
    private String role;
    private String approverRole;
    private Long approverId;
    private String approverName;
    private String status;
    private String comment;
    private String actionDate;
}
