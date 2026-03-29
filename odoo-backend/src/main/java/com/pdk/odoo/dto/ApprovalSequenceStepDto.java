package com.pdk.odoo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalSequenceStepDto {
    private Integer stepNumber;
    private String role;
    private Long approverId;
    private String approverName;
}
