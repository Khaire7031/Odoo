package com.pdk.odoo.controller;

import com.pdk.odoo.dto.ExpenseRequest;
import com.pdk.odoo.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.createExpense(request));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyExpenses(@RequestParam Long userId) {
        return ResponseEntity.ok(expenseService.getUserExpenses(userId));
    }

    @GetMapping("/company")
    public ResponseEntity<?> getCompanyExpenses(@RequestParam Long companyId) {
        return ResponseEntity.ok(expenseService.getCompanyExpenses(companyId));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long expenseId) {
        try {
            expenseService.deleteExpense(expenseId);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Expense successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
