package com.pdk.odoo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.pdk.odoo.model.Expense;
import com.pdk.odoo.service.ExpenseService;

@RestController
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/expenses/{id}")
    public List<Expense> getExpense(@PathVariable String id) {
        return expenseService.getAllExpenses(id);
    }
}
