package com.Farm.NASMS.service;

import java.util.List;

import com.Farm.NASMS.model.Farmer;

public interface FarmerService {
    List<Farmer> getAllFarmers();
    Farmer getFarmerById(Long id);
    Farmer getFarmerByNationalId(Long nationalId);
    Farmer addFarmer(Farmer farmer);
    Farmer updateFarmer(Long id, Farmer farmer);
    void deleteFarmer(Long id);
    Farmer getFarmerByEmail(String email);

}
