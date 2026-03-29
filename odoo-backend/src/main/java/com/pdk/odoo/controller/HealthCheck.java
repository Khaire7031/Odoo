package com.pdk.odoo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthCheck {

    private static final Logger logger = LoggerFactory.getLogger(HealthCheck.class);

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        logger.info("Health check endpoint called");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Application is running smoothly!");
        response.put("timestamp", LocalDateTime.now());

        logger.debug("Response sent: {}", response);

        return ResponseEntity.ok(response);
    }
}