package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.RegisterRequest;
import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.User;
import com.Farm.NASMS.service.AuthService;
import com.Farm.NASMS.service.FarmerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final FarmerService farmerService; // ADDED

    // FIXED: added FarmerService to constructor
    public AuthController(AuthService authService, FarmerService farmerService) {
        this.authService = authService;
        this.farmerService = farmerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            User savedUser = authService.register(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/register/farmer")
    public ResponseEntity<?> registerFarmer(@RequestBody RegisterRequest request) {
        try {
            // Create user account
            User user = new User();
            user.setUserName(request.getFullName());
            user.setEmailAddress(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole("FARMER");
            authService.register(user);

            // Create farmer profile
            Farmer farmer = new Farmer();
            farmer.setFullName(request.getFullName());
            farmer.setName(request.getFullName());
            farmer.setNationalId(Long.parseLong(request.getNationalId()));
            farmer.setPhoneNumber(request.getPhone());
            farmer.setEmail(request.getEmail());
            farmer.setFarmSize(request.getFarmSize());
            farmer.setTitleNumber(request.getTitleDeed());
            farmer.setCounty(request.getCounty());
            farmer.setFarmType(request.getFarmType());
            farmer.setRegisteredDate(java.time.LocalDate.now().toString());
            farmerService.addFarmer(farmer);

            return ResponseEntity.ok("Registration successful");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            String token = authService.login(user.getEmailAddress(), user.getPassword());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getEmailAddress()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}