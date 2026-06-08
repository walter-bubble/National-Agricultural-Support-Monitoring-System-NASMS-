package com.Farm.NASMS.Controller;

import com.Farm.NASMS.Farmer;
import com.Farm.NASMS.Service.FarmerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {
   private final FarmerService farmerService;
    public FarmerController(FarmerService farmerService){
        this.farmerService = farmerService;
    }
    @GetMapping("/")
    public List<Farmer> getAllFarmers(){
        return farmerService.getAllFarmers();
    }
    @GetMapping("/{id}")
    public Farmer getFarmerById(@PathVariable Long id){
        return farmerService.getFarmerById(id);
    }
    @GetMapping("/search/{nationalId}")
    public Farmer getFarmerByNationalId(@PathVariable Long nationalId){
        return farmerService.getFarmerByNationalId(nationalId);
    }
    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer){
        return farmerService.addFarmer(farmer);
    }
    @PutMapping("/{id}")
    public Farmer updateFarmer(@PathVariable Long id, @RequestBody Farmer farmer){
        return farmerService.updateFarmer(id,farmer);
    }
    @DeleteMapping("/{id}")
    public String deleteFarmer(@PathVariable Long id){
        farmerService.deleteFarmer(id);
        return "Farmer deleted successfully";
    }
}
