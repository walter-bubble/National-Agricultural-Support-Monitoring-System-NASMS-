package com.Farm.NASMS.model;

import com.Farm.NASMS.enums.ProductStatus;
import jakarta.persistence.*;

@Entity
@SuppressWarnings("unused")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double quantityUnit;
    private double unitPrice_ksh;

    // ADDED — now ProductStatus enum is used
    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @ManyToOne
    private Farmer farmer;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getQuantityUnit() { return quantityUnit; }
    public void setQuantityUnit(double quantityUnit) { this.quantityUnit = quantityUnit; }

    public double getUnitPrice_ksh() { return unitPrice_ksh; }
    public void setUnitPrice_ksh(double unitPrice_ksh) { this.unitPrice_ksh = unitPrice_ksh; }

    // ADDED — getter and setter for status
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Farmer getFarmer() { return farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }
}