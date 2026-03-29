package com.pdk.odoo.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private String id;
    private Long rawId;
    private String employeeName;
    private String employeeEmail;
    
    private BigDecimal amount;
    private String currency;
    private BigDecimal convertedAmount;
    private String baseCurrency;
    
    private String category;
    private String description;
    private String date;
    
    private String status;
    private String autoApproveReason;
    
    private List<ExpenseApprovalStepDto> approvalSteps;
}
