package com.Farm.NASMS.service;

import com.Farm.NASMS.model.User;
import com.Farm.NASMS.repository.UserRepository;
import com.Farm.NASMS.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil=jwtUtil;
    }
    @Override
    public User register(User user) {
        if(userRepository.findByEmailAddress(user.getEmailAddress()).isPresent()){
             throw new RuntimeException("user exists");
        }
        // encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // save
    User savedUser = userRepository.save(user);
        // hide password in response
        savedUser.setPassword(null);
        return savedUser;
    }
@Override
    public String login(String emailAddress, String password) {
        User user = userRepository.findByEmailAddress(emailAddress)
                .orElseThrow(()->new RuntimeException("user not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return jwtUtil.generateToken(emailAddress);
    }
}