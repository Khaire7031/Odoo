package com.pdk.odoo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "approval_sequence_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalSequenceStepTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_config_id")
    private CompanyConfig companyConfig;

    private Integer stepNumber;
    private String role;
    private Long approverId;
    private String approverName;
}
