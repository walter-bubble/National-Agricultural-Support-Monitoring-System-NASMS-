package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.service.FarmerService;
import com.Farm.NASMS.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;
    private final JwtUtil jwtUtil;

    public FarmerController(FarmerService farmerService, JwtUtil jwtUtil) {
        this.farmerService = farmerService;
        this.jwtUtil = jwtUtil;
    }

    // ADDED: /api/farmer/profile — called by dashboard
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUserName(token);
            Farmer farmer = farmerService.getFarmerByEmail(email);
            return ResponseEntity.ok(farmer);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @GetMapping("/")
    public List<Farmer> getAllFarmers() {
        return farmerService.getAllFarmers();
    }

    @GetMapping("/{id}")
    public Farmer getFarmerById(@PathVariable Long id) {
        return farmerService.getFarmerById(id);
    }

    @GetMapping("/search/{nationalId}")
    public Farmer getFarmerByNationalId(@PathVariable Long nationalId) {
        return farmerService.getFarmerByNationalId(nationalId);
    }

    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer) {
        return farmerService.addFarmer(farmer);
    }

    @PutMapping("/{id}")
    public Farmer updateFarmer(@PathVariable Long id, @RequestBody Farmer farmer) {
        return farmerService.updateFarmer(id, farmer);
    }

    @DeleteMapping("/{id}")
    public String deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return "Farmer deleted successfully";
    }
}