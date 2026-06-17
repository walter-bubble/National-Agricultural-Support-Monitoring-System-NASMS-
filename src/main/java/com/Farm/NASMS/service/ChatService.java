package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.ChatMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In‑memory chat service.
 * Stores messages in a simple list and assigns incremental IDs.
 * For a real application replace this with a persistent repository.
 */
@Service
public class ChatService {

    private final List<ChatMessage> messages = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1L);

    /**
     * Persist a new chat message and return the saved instance.
     */
    public ChatMessage sendMessage(String sender, String receiver, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setId(idGenerator.getAndIncrement());
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        synchronized (messages) {
            messages.add(msg);
        }
        return msg;
    }

    /**
     * Get the conversation (all messages) between two users, ordered by timestamp.
     */
    public List<ChatMessage> getConversation(String userA, String userB) {
        synchronized (messages) {
            return messages.stream()
                    .filter(m -> (m.getSender().equals(userA) && m.getReceiver().equals(userB))
                              || (m.getSender().equals(userB) && m.getReceiver().equals(userA)))
                    .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                    .collect(Collectors.toList());
        }
    }

    /**
     * Get all messages for a specific user (either sent or received), ordered by timestamp.
     */
    public List<ChatMessage> getAllForUser(String user) {
        synchronized (messages) {
            return messages.stream()
                    .filter(m -> m.getSender().equals(user) || m.getReceiver().equals(user))
                    .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                    .collect(Collectors.toList());
        }
    }
}
