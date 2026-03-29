package com.pdk.odoo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "company_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long companyId;
    
    private String baseCurrency;
    
    private String approvalRuleType;
    private Integer ruleMinPercentage;
    private Long ruleSpecificApproverId;
    private String ruleSpecificApproverName;

    @OneToMany(mappedBy = "companyConfig", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    private List<ApprovalSequenceStepTemplate> approvalSequence;
}
