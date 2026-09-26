package com.flowershop.controller;

import com.flowershop.model.User;
import com.flowershop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("message", "Email is already registered. Please login.");
            return ResponseEntity.badRequest().body(response);
        }

        userRepository.save(user);
        response.put("status", "success");
        response.put("message", "Registration successful! Please login.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, String> response = new HashMap<>();

        if (email == null || email.isBlank()) {
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (password != null && password.equals(user.getPassword())) {
                String token = "flower_token_" + UUID.randomUUID().toString();
                response.put("accessToken", token);
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            }
        }

        // Allow demo login if user created on the fly
        User newDemoUser = new User(email.split("@")[0], email, password != null ? password : "password");
        userRepository.save(newDemoUser);
        String token = "flower_token_" + UUID.randomUUID().toString();
        response.put("accessToken", token);
        response.put("name", newDemoUser.getName());
        response.put("email", newDemoUser.getEmail());
        return ResponseEntity.ok(response);
    }
}
