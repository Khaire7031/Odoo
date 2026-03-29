package com.pdk.odoo.service;

import com.pdk.odoo.dto.CreateUserRequest;
import com.pdk.odoo.dto.ManagerDto;
import com.pdk.odoo.model.Role;
import com.pdk.odoo.model.User;
import com.pdk.odoo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
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

    public List<com.pdk.odoo.dto.UserRecordDto> getAllUsersByCompanyId(Long companyId) {
        List<User> users = userRepository.findByCompanyId(companyId);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        return users.stream().map(u -> {
            String managerName = null;
            if (u.getManagerId() != null) {
                User mgr = userRepository.findById(u.getManagerId()).orElse(null);
                if (mgr != null) managerName = mgr.getFullName();
            }
            return com.pdk.odoo.dto.UserRecordDto.builder()
                    .id(String.valueOf(u.getId()))
                    .name(u.getFullName())
                    .email(u.getEmail())
                    .role(u.getRole().name().toLowerCase())
                    .managerId(u.getManagerId() != null ? String.valueOf(u.getManagerId()) : null)
                    .managerName(managerName)
                    .createdAt(u.getCreatedAt() != null ? sdf.format(u.getCreatedAt()) : sdf.format(new Date()))
                    .build();
        }).collect(Collectors.toList());
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
                .createdAt(new Date())
                .build();
        userRepository.save(newUser);
    }

    public void updateUser(Long userId, CreateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            } catch (Exception e) {}
        }
        if (request.getManagerId() != null) user.setManagerId(request.getManagerId());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
