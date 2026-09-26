package com.flowershop.controller;

import com.flowershop.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(originPatterns = "*")
public class OrderController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout(@RequestBody(required = false) Map<String, Object> orderDetails,
                                                         @RequestParam(defaultValue = "user@example.com") String email) {
        // Clear user cart upon successful checkout
        try {
            cartItemRepository.deleteByUserEmail(email);
        } catch (Exception ignored) {}

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Order placed successfully with Spring Boot Backend!");
        return ResponseEntity.ok(response);
    }
}
