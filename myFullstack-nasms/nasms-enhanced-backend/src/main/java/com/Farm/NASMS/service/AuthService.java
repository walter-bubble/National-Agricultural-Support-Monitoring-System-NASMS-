package com.Farm.NASMS.service;

import com.Farm.NASMS.model.User;
import java.util.Map;

public interface AuthService {
    User register(User user);
    /** Returns token + username + role in a map. */
    Map<String, String> login(String emailAddress, String password);
}
