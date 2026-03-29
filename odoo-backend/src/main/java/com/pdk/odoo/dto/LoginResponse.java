package com.pdk.odoo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String message;
    private Long userId;
    private Long companyId;
    private String role;
    private String name;
    private String token;
}
