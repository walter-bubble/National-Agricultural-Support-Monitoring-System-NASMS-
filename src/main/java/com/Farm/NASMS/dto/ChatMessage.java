package com.Farm.NASMS.dto;

import java.time.LocalDateTime;

/**
 * Simple chat message model used for sending/receiving messages via the ChatController.
 */
public class ChatMessage {
    private long id;
    private String sender;
    private String receiver;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessage() {}

    public ChatMessage(long id, String sender, String receiver, String content, LocalDateTime timestamp) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timestamp = timestamp;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getSender() {
        return sender;
    }
    public void setSender(String sender) {
        this.sender = sender;
    }
    public String getReceiver() {
        return receiver;
    }
    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}