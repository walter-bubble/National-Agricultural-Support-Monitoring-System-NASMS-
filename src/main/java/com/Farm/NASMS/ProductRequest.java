package com.Farm.NASMS;

public class ProductRequest {
    private String name;
    private double quantityUnit;
    private double unit_price_ksh;
    private Long farmerId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getQuantityUnit() {
        return quantityUnit;
    }

    public void setQuantityUnit(double quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

    public double getUnit_Price_ksh() {
        return unit_price_ksh;
    }

    public void setUnit_Price_ksh(double unit_price_ksh) {
        this.unit_price_ksh = unit_price_ksh;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }
}
