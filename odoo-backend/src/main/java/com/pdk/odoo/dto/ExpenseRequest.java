package com.pdk.odoo.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {
    private Long userId;
    private Long companyId;
    private BigDecimal amount;
    private String currency;
    private BigDecimal convertedAmount;
    private String baseCurrency;
    private String category;
    private String description;
    private String date;
}
