package com.Farm.NASMS.Service;

import com.Farm.NASMS.Farmer;

import java.util.List;

public interface FarmerService {
    List<Farmer> getAllFarmers();
    Farmer getFarmerById(Long id);
    Farmer getFarmerByNationalId(Long nationalId);
    Farmer addFarmer(Farmer farmer);
    Farmer updateFarmer(Long id, Farmer farmer);
    void deleteFarmer(Long id);


}
;