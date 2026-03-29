package com.pdk.odoo.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String role;
    private Long managerId;
    private String password;
}
