package com.pdk.odoo.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String fullName;
    private String companyName;
    private String countryName;
    private String email;
    private String password;
}
