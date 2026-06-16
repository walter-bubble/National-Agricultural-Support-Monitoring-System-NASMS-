package com.Farm.NASMS.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    public void sendAlert(String message){
        System.out.println("NOTIFICATION: "+ message);
    }
}
