package com.Farm.NASMS.dto;

public class RegisterRequest {
    private String fullName;
    private String nationalId;
    private String phone;
    private String email;
    private double farmSize;
    private String titleDeed;
    private String county;
    private String subCounty;
    private String ward;
    private String farmType;
    private String password;

    public String getFullName()             { return fullName; }
    public void setFullName(String v)       { this.fullName = v; }
    public String getNationalId()           { return nationalId; }
    public void setNationalId(String v)     { this.nationalId = v; }
    public String getPhone()                { return phone; }
    public void setPhone(String v)          { this.phone = v; }
    public String getEmail()                { return email; }
    public void setEmail(String v)          { this.email = v; }
    public double getFarmSize()             { return farmSize; }
    public void setFarmSize(double v)       { this.farmSize = v; }
    public String getTitleDeed()            { return titleDeed; }
    public void setTitleDeed(String v)      { this.titleDeed = v; }
    public String getCounty()               { return county; }
    public void setCounty(String v)         { this.county = v; }
    public String getSubCounty()            { return subCounty; }
    public void setSubCounty(String v)      { this.subCounty = v; }
    public String getWard()                 { return ward; }
    public void setWard(String v)           { this.ward = v; }
    public String getFarmType()             { return farmType; }
    public void setFarmType(String v)       { this.farmType = v; }
    public String getPassword()             { return password; }
    public void setPassword(String v)       { this.password = v; }
}
