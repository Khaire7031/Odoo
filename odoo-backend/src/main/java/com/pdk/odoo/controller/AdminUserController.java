package com.pdk.odoo.controller;

import com.pdk.odoo.dto.CreateUserRequest;
import com.pdk.odoo.dto.ManagerDto;
import com.pdk.odoo.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/companies/{companyId}")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/managers")
    public ResponseEntity<List<ManagerDto>> getManagers(@PathVariable Long companyId) {
        return ResponseEntity.ok(adminUserService.getManagersByCompanyId(companyId));
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<com.pdk.odoo.dto.UserRecordDto>> getAllUsers(@PathVariable Long companyId) {
        return ResponseEntity.ok(adminUserService.getAllUsersByCompanyId(companyId));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@PathVariable Long companyId, @RequestBody CreateUserRequest request) {
        try {
            adminUserService.createUser(companyId, request);
            return ResponseEntity.ok().body(Map.of("message", "User successfully created"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long companyId, @PathVariable Long userId, @RequestBody CreateUserRequest request) {
        try {
            adminUserService.updateUser(userId, request);
            return ResponseEntity.ok().body(Map.of("message", "User successfully updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long companyId, @PathVariable Long userId) {
        try {
            adminUserService.deleteUser(userId);
            return ResponseEntity.ok().body(Map.of("message", "User successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
