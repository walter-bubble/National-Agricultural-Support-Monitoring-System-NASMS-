package com.Farm.NASMS.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "loan_package")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class LoanPackage {

    @Id
    private String loanCode;

    private double amount;
    private double interestRate;
    private int    durationMonths;
    private double monthlyPenalty;
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id")
    @JsonIgnoreProperties({"loans","marketTransactions","loanPackages","hibernateLazyInitializer","handler"})
    private FarmingSeason farmingSeason;

    public LoanPackage() {}

    public String        getLoanCode()                  { return loanCode; }
    public void          setLoanCode(String v)          { this.loanCode = v; }
    public double        getAmount()                    { return amount; }
    public void          setAmount(double v)            { this.amount = v; }
    public double        getInterestRate()              { return interestRate; }
    public void          setInterestRate(double v)      { this.interestRate = v; }
    public int           getDurationMonths()            { return durationMonths; }
    public void          setDurationMonths(int v)       { this.durationMonths = v; }
    public double        getMonthlyPenalty()            { return monthlyPenalty; }
    public void          setMonthlyPenalty(double v)    { this.monthlyPenalty = v; }
    public String        getDescription()               { return description; }
    public void          setDescription(String v)       { this.description = v; }
    public FarmingSeason getFarmingSeason()             { return farmingSeason; }
    public void          setFarmingSeason(FarmingSeason v) { this.farmingSeason = v; }
}
