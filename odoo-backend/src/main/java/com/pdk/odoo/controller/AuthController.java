package com.pdk.odoo.controller;

import com.pdk.odoo.dto.SignupRequest;
import com.pdk.odoo.dto.SignupResponse;
import com.pdk.odoo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request) {
        try {
            return ResponseEntity.ok(authService.registerCompanyAndAdmin(request));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(SignupResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody com.pdk.odoo.dto.LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.signIn(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
