package com.pdk.odoo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRuleDto {
    private String type;
    private Integer minPercentage;
    private Long specificApproverId;
    private String specificApproverName;
}
