package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.service.FarmerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    /** GET /api/farmers/profile — dashboard: logged-in farmer's own profile */
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal String email) {
        try {
            Farmer farmer = farmerService.getFarmerByEmail(email);
            return ResponseEntity.ok(farmer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Farmer profile not found for this account.");
        }
    }

    /** GET /api/farmers/ — admin: all farmers */
    @GetMapping("/")
    public List<Farmer> getAllFarmers() {
        return farmerService.getAllFarmers();
    }

    /** GET /api/farmers/{id} */
    @GetMapping("/{id}")
    public Farmer getFarmerById(@PathVariable Long id) {
        return farmerService.getFarmerById(id);
    }

    /** GET /api/farmers/search/{nationalId} */
    @GetMapping("/search/{nationalId}")
    public Farmer getFarmerByNationalId(@PathVariable Long nationalId) {
        return farmerService.getFarmerByNationalId(nationalId);
    }

    /** POST /api/farmers */
    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer) {
        return farmerService.addFarmer(farmer);
    }

    /** PUT /api/farmers/{id} */
    @PutMapping("/{id}")
    public Farmer updateFarmer(@PathVariable Long id, @RequestBody Farmer farmer) {
        return farmerService.updateFarmer(id, farmer);
    }

    /** DELETE /api/farmers/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }
}
