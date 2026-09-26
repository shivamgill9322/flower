package com.flowershop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FlowerShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(FlowerShopApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println(" 🌸 FLOWER SHOP SPRING BOOT BACKEND IS RUNNING 🌸");
        System.out.println(" REST API Base URL: http://localhost:8090/api");
        System.out.println(" H2 Database Console: http://localhost:8090/h2-console");
        System.out.println("=======================================================\n");
    }
}
