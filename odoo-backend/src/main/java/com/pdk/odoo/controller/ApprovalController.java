package com.pdk.odoo.controller;

import com.pdk.odoo.dto.ApprovalActionRequest;
import com.pdk.odoo.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingForApprover(@RequestParam Long approverId) {
        return ResponseEntity.ok(approvalService.getPendingForApprover(approverId));
    }

    @PostMapping("/{expenseId}/action")
    public ResponseEntity<?> processAction(@PathVariable Long expenseId, @RequestBody ApprovalActionRequest request) {
        try {
            approvalService.processAction(expenseId, request);
            return ResponseEntity.ok(java.util.Map.of("message", "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
