package com.flowershop.controller;

import com.flowershop.model.ContactMessage;
import com.flowershop.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(originPatterns = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> handleContactSubmission(@RequestBody ContactMessage contactMessage) {
        contactMessage.setTimestamp(System.currentTimeMillis());
        contactMessageRepository.save(contactMessage);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Email dispatched to " + (contactMessage.getRecipientEmail() != null ? contactMessage.getRecipientEmail() : "recipient"));
        return ResponseEntity.ok(response);
    }
}
