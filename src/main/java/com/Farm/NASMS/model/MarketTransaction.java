package com.Farm.NASMS.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MarketTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="season_id",nullable = false)
    private FarmingSeason season;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String sellerType;
    private String sellerName;
    private Long sellerId;

    private String buyerName;
    private Long buyerId;

    private String productName;
    private String productCode;
    private double quantity;
    private double price;

    private LocalDateTime transactionDate = LocalDateTime.now();

    public MarketTransaction(){}

    public MarketTransaction(String sellerType, String sellerName, String buyerName, String productName, double quantity, double price,String productCode){
        this.sellerType=sellerType;
        this.sellerName=sellerName;
        this.buyerName=buyerName;
        this.productName=productName;
        this.quantity=quantity;
        this.price=price;
        this.productCode=productCode;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSellerType() {
        return sellerType;
    }

    public void setSellerType(String sellerType) {
        this.sellerType = sellerType;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
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

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public FarmingSeason getSeason() {
        return season;
    }

    public void setSeason(FarmingSeason season) {
        this.season = season;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
