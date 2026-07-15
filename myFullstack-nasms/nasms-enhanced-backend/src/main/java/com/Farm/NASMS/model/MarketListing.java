package com.Farm.NASMS.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_listing")
public class MarketListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productCode;
    private String sellerName;
    private Long   sellerId;
    private String sellerType;
    private String productName;
    private double quantity;
    private double price;

    @Column(updatable = false)
    private LocalDateTime created;

    @PrePersist
    protected void onCreate() { created = LocalDateTime.now(); }

    public MarketListing() {}

    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }
    public String getProductCode()                   { return productCode; }
    public void setProductCode(String productCode)   { this.productCode = productCode; }
    public String getSellerName()                    { return sellerName; }
    public void setSellerName(String sellerName)     { this.sellerName = sellerName; }
    public Long getSellerId()                        { return sellerId; }
    public void setSellerId(Long sellerId)           { this.sellerId = sellerId; }
    public String getSellerType()                    { return sellerType; }
    public void setSellerType(String sellerType)     { this.sellerType = sellerType; }
    public String getProductName()                   { return productName; }
    public void setProductName(String productName)   { this.productName = productName; }
    public double getQuantity()                      { return quantity; }
    public void setQuantity(double quantity)         { this.quantity = quantity; }
    public double getPrice()                         { return price; }
    public void setPrice(double price)               { this.price = price; }
    public LocalDateTime getCreated()                { return created; }
    public void setCreated(LocalDateTime created)    { this.created = created; }
}
