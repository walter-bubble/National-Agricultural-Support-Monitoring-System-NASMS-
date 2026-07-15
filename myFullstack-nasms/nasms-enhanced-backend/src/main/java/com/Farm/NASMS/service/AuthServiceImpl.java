package com.Farm.NASMS.service;

import com.Farm.NASMS.model.User;
import com.Farm.NASMS.repository.UserRepository;
import com.Farm.NASMS.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
    }

    @Override
    public User register(User user) {
        if (userRepository.findByEmailAddress(user.getEmailAddress()).isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        // Return a safe copy — never expose the hashed password
        User response = new User();
        response.setId(user.getId());
        response.setUserName(user.getUserName());
        response.setEmailAddress(user.getEmailAddress());
        response.setRole(user.getRole());
        return response;
    }

    @Override
    public Map<String, String> login(String emailAddress, String password) {
        User user = userRepository.findByEmailAddress(emailAddress)
                .orElseThrow(() -> new RuntimeException("No account found for this email."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Incorrect password.");
        }

        String role  = user.getRole() != null ? user.getRole() : "FARMER";
        String token = jwtUtil.generateToken(emailAddress, role);

        return Map.of(
                "token",    token,
                "username", user.getUserName() != null ? user.getUserName() : emailAddress,
                "role",     role
        );
    }
}
