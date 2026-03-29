package com.pdk.odoo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OdooHackethonApplication {

	public static void main(String[] args) {
		SpringApplication.run(OdooHackethonApplication.class, args);
		System.out.println("-------------------------------------");
		System.out.println("Odoo Hackethon Application Started!");
		System.out.println("-------------------------------------");
	}

}
