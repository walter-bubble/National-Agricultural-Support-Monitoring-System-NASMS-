package com.Farm.NASMS.service;

import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.repository.FarmerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FarmerServiceImpl implements FarmerService {

    private FarmerRepository farmerRepository;

    public FarmerServiceImpl(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    @Override
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    @Override
    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found!"));
    }

    @Override
    public Farmer getFarmerByNationalId(Long nationalId) {
        return farmerRepository.findByNationalId(nationalId)
                .orElseThrow(() -> new RuntimeException("Farmer not found!"));
    }

    // ADDED — used by /api/farmers/profile to look up farmer from JWT email
    @Override
    public Farmer getFarmerByEmail(String email) {
        return farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for email: " + email));
    }

    @Override
    public Farmer addFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    @Override
    public Farmer updateFarmer(Long id, Farmer farmer) {
        // FIXED: ensure the correct ID is set before saving
        farmer.setId(id);
        return farmerRepository.save(farmer);
    }

    @Override
    public void deleteFarmer(Long id) {
        Farmer farmer = getFarmerById(id);
        farmerRepository.delete(farmer);
    }
}