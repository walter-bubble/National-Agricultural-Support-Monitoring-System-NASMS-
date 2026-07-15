package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.RegisterRequest;
import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.User;
import com.Farm.NASMS.service.AuthService;
import com.Farm.NASMS.service.FarmerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService   authService;
    private final FarmerService farmerService;

    public AuthController(AuthService authService, FarmerService farmerService) {
        this.authService   = authService;
        this.farmerService = farmerService;
    }

    /**
     * POST /api/auth/register
     * Register a plain user (ADMIN, BUYER, SELLER).
     * Body: { userName, emailAddress, password, role }
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("FARMER");
            }
            User saved = authService.register(user);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register/farmer
     * Register a farmer (creates both a User + Farmer record).
     */
    @PostMapping("/register/farmer")
    public ResponseEntity<?> registerFarmer(@RequestBody RegisterRequest req) {
        try {
            // Create user account
            User user = new User();
            user.setUserName(req.getFullName());
            user.setEmailAddress(req.getEmail());
            user.setPassword(req.getPassword());
            user.setRole("FARMER");
            authService.register(user);

            // Create farmer profile
            Farmer farmer = new Farmer();
            farmer.setFullName(req.getFullName());
            farmer.setName(req.getFullName());
            farmer.setNationalId(Long.parseLong(req.getNationalId()));
            farmer.setPhoneNumber(req.getPhone());
            farmer.setEmail(req.getEmail());
            farmer.setFarmSize(req.getFarmSize());
            farmer.setTitleNumber(req.getTitleDeed());
            farmer.setCounty(req.getCounty());
            farmer.setSubCounty(req.getSubCounty());
            farmer.setWard(req.getWard());
            farmer.setFarmType(req.getFarmType());
            farmer.setRegisteredDate(java.time.LocalDate.now().toString());
            farmerService.addFarmer(farmer);

            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Body: { emailAddress, password }
     * Returns: { token, username, role }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email    = body.get("emailAddress");
            String password = body.get("password");
            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "emailAddress and password are required"));
            }
            Map<String, String> result = authService.login(email, password);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
