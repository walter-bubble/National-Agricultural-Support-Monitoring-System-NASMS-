package com.Farm.NASMS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getNotifications(
            @AuthenticationPrincipal String email) {

        // Placeholder — replace with DB-driven notifications when needed
        List<Map<String, String>> notifications = List.of(
                Map.of("type", "success",
                       "text", "Welcome back! Your NASMS dashboard is ready.",
                       "time", "just now"),
                Map.of("type", "info",
                       "text", "New government loan packages are available for the 2026 season.",
                       "time", "1 hour ago"),
                Map.of("type", "warning",
                       "text", "Remember to update your farm records before the season closes.",
                       "time", "Yesterday")
        );
        return ResponseEntity.ok(notifications);
    }
}
