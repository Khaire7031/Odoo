package com.pdk.odoo.repository;

import com.pdk.odoo.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

    @Query("SELECT DISTINCT c.name FROM Country c WHERE c.name IS NOT NULL ORDER BY c.name")
    List<String> findDistinctNames();

    Country findFirstByName(String name);
}
