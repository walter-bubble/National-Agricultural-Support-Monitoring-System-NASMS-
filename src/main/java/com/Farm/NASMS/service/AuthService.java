package com.Farm.NASMS.service;

import com.Farm.NASMS.model.User;


public interface AuthService {
User register(User user);
    String login(String emailAddress, String password);
}
