package com.Farm.NASMS.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "farmers", uniqueConstraints = @UniqueConstraint(columnNames = "national_id"))
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String fullName;
    private String farmType;
    private String registeredDate;

    @Column(name = "national_id", unique = true, nullable = false)
    private Long nationalId;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    private double farmSize;
    private String titleNumber;
    private String county;
    private String subCounty;
    private String ward;

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }
    public String getFullName()                  { return fullName; }
    public void setFullName(String fullName)     { this.fullName = fullName; }
    public String getFarmType()                  { return farmType; }
    public void setFarmType(String farmType)     { this.farmType = farmType; }
    public String getRegisteredDate()            { return registeredDate; }
    public void setRegisteredDate(String d)      { this.registeredDate = d; }
    public Long getNationalId()                  { return nationalId; }
    public void setNationalId(Long id)           { this.nationalId = id; }
    public String getPhoneNumber()               { return phoneNumber; }
    public void setPhoneNumber(String p)         { this.phoneNumber = p; }
    public String getEmail()                     { return email; }
    public void setEmail(String email)           { this.email = email; }
    public double getFarmSize()                  { return farmSize; }
    public void setFarmSize(double farmSize)     { this.farmSize = farmSize; }
    public String getTitleNumber()               { return titleNumber; }
    public void setTitleNumber(String t)         { this.titleNumber = t; }
    public String getCounty()                    { return county; }
    public void setCounty(String county)         { this.county = county; }
    public String getSubCounty()                 { return subCounty; }
    public void setSubCounty(String s)           { this.subCounty = s; }
    public String getWard()                      { return ward; }
    public void setWard(String ward)             { this.ward = ward; }
}
