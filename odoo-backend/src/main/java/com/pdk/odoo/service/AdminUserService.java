package com.pdk.odoo.service;

import com.pdk.odoo.dto.CreateUserRequest;
import com.pdk.odoo.dto.ManagerDto;
import com.pdk.odoo.model.Role;
import com.pdk.odoo.model.User;
import com.pdk.odoo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ManagerDto> getManagersByCompanyId(Long companyId) {
        return userRepository.findByCompanyIdAndRole(companyId, Role.MANAGER)
                .stream()
                .map(user -> ManagerDto.builder()
                        .id(user.getId())
                        .name(user.getFullName())
                        .build())
                .collect(Collectors.toList());
    }

    public void createUser(Long companyId, CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use.");
        }

        Role assignedRole;
        try {
            assignedRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role provided. Must be EMPLOYEE or MANAGER.");
        }

        // Generate default password if unused/empty
        String rawPassword = (request.getPassword() == null || request.getPassword().isEmpty()) 
                                ? "Welcome123!" : request.getPassword();

        User newUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .role(assignedRole)
                .companyId(companyId)
                .managerId(assignedRole == Role.MANAGER ? null : request.getManagerId())
                .build();

        userRepository.save(newUser);
    }
}
