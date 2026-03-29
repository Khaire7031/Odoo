package com.pdk.odoo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalActionRequest {
    private String action; // "approve" or "reject"
    private String comment;
    private Long approverId;
}
