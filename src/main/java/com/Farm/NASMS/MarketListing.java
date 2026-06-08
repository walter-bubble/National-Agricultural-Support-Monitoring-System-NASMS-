package com.Farm.NASMS;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class MarketListing {
    @Id
    private String productCode;

    private String sellerName;
    private Long sellerId;
    private String sellerType;
    private String productName;
    private double quantity;
    private double price;

    private LocalDateTime created = LocalDateTime.now();
    public MarketListing(String productCode,String sellerName,Long sellerId,String sellerType,String productName,double quantity,double price){
        this.sellerName=sellerName;
        this.sellerId=sellerId;
        this.sellerType=sellerType;
        this.productName=productName;
        this.quantity=quantity;
        this.price=price;
    }

    public MarketListing(){}
    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerType() {
        return sellerType;
    }

    public void setSellerType(String sellerType) {
        this.sellerType = sellerType;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
}
