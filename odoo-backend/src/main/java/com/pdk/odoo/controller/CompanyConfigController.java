package com.pdk.odoo.controller;

import com.pdk.odoo.dto.CompanyConfigDto;
import com.pdk.odoo.service.CompanyConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies/{companyId}/config")
@RequiredArgsConstructor
public class CompanyConfigController {
    
    private final CompanyConfigService configService;

    @GetMapping
    public ResponseEntity<?> getConfig(@PathVariable Long companyId) {
        try {
            return ResponseEntity.ok(configService.getConfig(companyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> saveConfig(@PathVariable Long companyId, @RequestBody CompanyConfigDto dto) {
        return ResponseEntity.ok(configService.saveConfig(companyId, dto));
    }
}
