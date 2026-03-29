package com.pdk.odoo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRecordDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String managerId;
    private String managerName;
    private String createdAt;
}
