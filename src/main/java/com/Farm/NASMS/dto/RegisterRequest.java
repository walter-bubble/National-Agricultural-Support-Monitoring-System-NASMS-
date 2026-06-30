package com.Farm.NASMS.dto;

public class RegisterRequest {
    private String fullName;
    private String nationalId;
    private String phone;
    private String email;
    private double farmSize;
    private String titleDeed;
    private String county;
    private String farmType;
    private String password;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getFarmSize() { return farmSize; }
    public void setFarmSize(double farmSize) { this.farmSize = farmSize; }

    public String getTitleDeed() { return titleDeed; }
    public void setTitleDeed(String titleDeed) { this.titleDeed = titleDeed; }

    public String getCounty() { return county; }
    public void setCounty(String county) { this.county = county; }

    public String getFarmType() { return farmType; }
    public void setFarmType(String farmType) { this.farmType = farmType; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}