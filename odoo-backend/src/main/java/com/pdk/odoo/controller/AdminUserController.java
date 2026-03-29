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
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/managers")
    public ResponseEntity<List<ManagerDto>> getManagers(@PathVariable Long companyId) {
        return ResponseEntity.ok(adminUserService.getManagersByCompanyId(companyId));
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
}
