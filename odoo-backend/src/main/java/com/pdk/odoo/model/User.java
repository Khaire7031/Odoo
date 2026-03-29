package com.pdk.odoo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String username;
    private String email;
    private String password; // BCrypt hashed

    @Enumerated(EnumType.STRING)
    private Role role; // EMPLOYEE, MANAGER, ADMIN

    @Enumerated(EnumType.STRING)
    private Designation designation; // FINANCE, DIRECTOR, CFO — null for EMPLOYEE/ADMIN

    private Long managerId; // EMPLOYEE only → FK → users.id
    private Boolean isManagerApprover; // EMPLOYEE only

    private Long companyId; // FK → company.id
}
