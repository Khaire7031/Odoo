package com.pdk.odoo.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String role; // "EMPLOYEE" or "MANAGER"
    private Long managerId; // for employees only
    private String password; // optional, can default if null
}
