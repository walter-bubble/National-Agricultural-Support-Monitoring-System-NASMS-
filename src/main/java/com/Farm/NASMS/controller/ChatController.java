package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.ChatMessage;
import com.Farm.NASMS.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Simple chat controller exposing endpoints to send and retrieve messages.
 * In a production system you would secure these endpoints and persist messages.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Send a new chat message.
     * @param request payload containing sender, receiver and content
     */
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage request) {
        ChatMessage saved = chatService.sendMessage(request.getSender(), request.getReceiver(), request.getContent());
        return ResponseEntity.ok(saved);
    }

    /**
     * Retrieve the conversation between two users.
     */
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessage>> getConversation(
            @RequestParam String userA,
            @RequestParam String userB) {
        List<ChatMessage> conv = chatService.getConversation(userA, userB);
        return ResponseEntity.ok(conv);
    }

    /**
     * Retrieve all messages for a given user (sent or received).
     */
    @GetMapping("/user")
    public ResponseEntity<List<ChatMessage>> getMessagesForUser(@RequestParam String user) {
        List<ChatMessage> msgs = chatService.getAllForUser(user);
        return ResponseEntity.ok(msgs);
    }
}

