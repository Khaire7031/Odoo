package com.pdk.odoo.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdk.odoo.model.Country;
import com.pdk.odoo.repository.CountryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Configuration
@Slf4j
public class DataLoaderConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CommandLineRunner loadCountryData(CountryRepository countryRepository, RestTemplate restTemplate) {
        return args -> {
            if (countryRepository.count() == 0) {
                log.info("Country table is empty. Fetching data from external API...");
                try {
                    String url = "https://restcountries.com/v3.1/all?fields=name,currencies";
                    String response = restTemplate.getForObject(url, String.class);

                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode rootNode = mapper.readTree(response);

                    List<Country> countries = new ArrayList<>();

                    if (rootNode.isArray()) {
                        for (JsonNode node : rootNode) {
                            String countryName = node.path("name").path("common").asText();
                            JsonNode currenciesNode = node.path("currencies");

                            if (!currenciesNode.isMissingNode() && !currenciesNode.isEmpty()) {
                                Iterator<Map.Entry<String, JsonNode>> fields = currenciesNode.properties().iterator();
                                // Create an entry for each currency if a country has multiple
                                while (fields.hasNext()) {
                                    Map.Entry<String, JsonNode> entry = fields.next();
                                    String code = entry.getKey();
                                    JsonNode currencyData = entry.getValue();

                                    String currName = currencyData.path("name").asText();
                                    String currSymbol = currencyData.path("symbol").asText();

                                    countries.add(Country.builder()
                                            .name(countryName)
                                            .currencyCode(code)
                                            .currencyName(currName)
                                            .currencySymbol(currSymbol)
                                            .build());
                                }
                            } else {
                                // For countries without currency data
                                countries.add(Country.builder()
                                        .name(countryName)
                                        .build());
                            }
                        }
                    }

                    countryRepository.saveAll(countries);
                    log.info("Successfully fetched and saved {} country-currency records.", countries.size());

                } catch (Exception e) {
                    log.error("Failed to load country data from external API", e);
                }
            } else {
                log.info("Country data already loaded. Skipping API fetch.");
            }
        };
    }
}
