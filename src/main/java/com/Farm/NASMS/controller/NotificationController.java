package com.Farm.NASMS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    // Returns basic notifications — replace with real DB data later
    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader("Authorization") String authHeader) {
        List<Map<String, String>> notifications = List.of(
                Map.of("color", "#2d7a4f",
                        "text", "Fertilizer request approved and awaiting dispatch.",
                        "time", "2 hours ago"),
                Map.of("color", "#d4a96a",
                        "text", "Loan repayment: KES 42,000 due by April 15, 2026.",
                        "time", "Yesterday"),
                Map.of("color", "#4a90d9",
                        "text", "Heavy rains expected in Murang'a this weekend.",
                        "time", "2 days ago")
        );
        return ResponseEntity.ok(notifications);
    }
}