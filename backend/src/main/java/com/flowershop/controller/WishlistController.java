package com.flowershop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(originPatterns = "*")
public class WishlistController {

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<Map<String, String>> toggleWishlist(@PathVariable Long productId) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Product #" + productId + " wishlist status updated!");
        return ResponseEntity.ok(response);
    }
}
