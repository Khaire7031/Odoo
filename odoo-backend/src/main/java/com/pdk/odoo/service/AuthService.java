package com.pdk.odoo.service;

import com.pdk.odoo.dto.SignupRequest;
import com.pdk.odoo.dto.SignupResponse;
import com.pdk.odoo.model.Company;
import com.pdk.odoo.model.Country;
import com.pdk.odoo.model.Role;
import com.pdk.odoo.model.User;
import com.pdk.odoo.repository.CompanyRepository;
import com.pdk.odoo.repository.CountryRepository;
import com.pdk.odoo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CountryRepository countryRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public SignupResponse registerCompanyAndAdmin(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use.");
        }

        Country country = countryRepository.findFirstByName(request.getCountryName());
        if (country == null) {
            throw new RuntimeException("Country not found: " + request.getCountryName());
        }

        Company company = Company.builder()
                .name(request.getCompanyName())
                .country(country.getName())
                .currencyCode(country.getCurrencyCode())
                .currencyName(country.getCurrencyName())
                .currencySymbol(country.getCurrencySymbol())
                .createdAt(new Date())
                .build();

        company = companyRepository.save(company);

        User adminUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .companyId(company.getId())
                .build();

        adminUser = userRepository.save(adminUser);

        return SignupResponse.builder()
                .message("Company and Admin user registered successfully.")
                .companyId(company.getId())
                .adminUserId(adminUser.getId())
                .build();
    }

    @Transactional(readOnly = true)
    public com.pdk.odoo.dto.LoginResponse signIn(com.pdk.odoo.dto.LoginRequest request) {
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role provided.");
        }

        User user = userRepository.findByUsernameAndRole(request.getUsername(), role)
                .orElseThrow(() -> new RuntimeException("Invalid credentials or role mismatch."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials.");
        }

        return com.pdk.odoo.dto.LoginResponse.builder()
                .message("Login successful")
                .userId(user.getId())
                .companyId(user.getCompanyId())
                .role(user.getRole().name())
                .name(user.getFullName())
                .token("mock-jwt-token-" + System.currentTimeMillis())
                .build();
    }
}
