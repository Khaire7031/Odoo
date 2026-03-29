package com.pdk.odoo.controller;

import com.pdk.odoo.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.pdk.odoo.model.Country;
@RestController
@RequestMapping("/api/public/countries")
@RequiredArgsConstructor
public class PublicDataController {
    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<List<Country>> getCountries() {
        return ResponseEntity.ok(countryService.getCountries());
    }
}
