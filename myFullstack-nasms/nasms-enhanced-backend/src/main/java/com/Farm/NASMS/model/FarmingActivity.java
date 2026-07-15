package com.Farm.NASMS.model;

import com.Farm.NASMS.enums.FarmingType;

import jakarta.persistence.*;

@Entity
public class FarmingActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private FarmingType farmingType;

    private String category;
    private String breedOrVariety;

    @ManyToOne
    private Farmer farmer;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FarmingType getFarmingType() {
        return farmingType;
    }

    public void setFarmingType(FarmingType farmingType) {
        this.farmingType = farmingType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBreedOrVariety() {
        return breedOrVariety;
    }

    public void setBreedOrVariety(String breedOrVariety) {
        this.breedOrVariety = breedOrVariety;
    }

    public Farmer getFarmer() {
        return farmer;
    }

    public void setFarmer(Farmer farmer) {
        this.farmer = farmer;
    }
}
