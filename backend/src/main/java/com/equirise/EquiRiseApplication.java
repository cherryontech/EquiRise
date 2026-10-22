package com.equirise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EquiRiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(EquiRiseApplication.class, args);
    }
}
