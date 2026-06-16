package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.User;
import com.Farm.NASMS.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService)
    {
        this.authService = authService;
    }
    //register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user){
        try{
        User savedUser=authService.register(user);
        return ResponseEntity.ok(savedUser);
        }
    catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
    }
    //login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user){
        try {
            String token = authService.login(user.getEmailAddress(), user.getPassword());
            return ResponseEntity.ok(token);
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
