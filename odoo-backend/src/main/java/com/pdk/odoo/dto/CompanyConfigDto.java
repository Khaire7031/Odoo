package com.pdk.odoo.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyConfigDto {
    private String companyName;
    private String country;
    private String baseCurrency;
    private ApprovalRuleDto approvalRule;
    private List<ApprovalSequenceStepDto> approvalSequence;
}
