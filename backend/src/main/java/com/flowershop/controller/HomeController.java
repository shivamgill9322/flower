package com.flowershop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(originPatterns = "*")
public class HomeController {

    @GetMapping({"/", "/api"})
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Flower Shop Spring Boot REST API");
        response.put("message", "🌸 Flower Shop Backend is up and running!");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Products", "/api/products");
        endpoints.put("Reviews", "/api/reviews");
        endpoints.put("Cart", "/api/cart");
        endpoints.put("Wishlist", "/api/wishlist");
        endpoints.put("H2 Console", "/h2-console");
        
        response.put("endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
}
