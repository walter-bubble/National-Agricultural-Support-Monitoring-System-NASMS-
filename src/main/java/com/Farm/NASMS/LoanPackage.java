package com.Farm.NASMS;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LoanPackage {
    @Id
    private String loanCode;

    private double amount;
    private double interestRate;
    private int durationMonths;
    private double monthlyPenalty;
    private String description;

    @ManyToOne
    @JoinColumn(name="season_id")
    private FarmingSeason farmingSeason;

    public LoanPackage(){}

    public String getLoanCode() {
        return loanCode;
    }

    public void setLoanCode(String loanCode) {
        this.loanCode = loanCode;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }
    public int getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(int durationMonths) {
        this.durationMonths = durationMonths;
    }

    public double getMonthlyPenalty() {
        return monthlyPenalty;
    }

    public void setMonthlyPenalty(double monthlyPenalty) {
        this.monthlyPenalty = monthlyPenalty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public FarmingSeason getFarmingSeason() {
        return farmingSeason;
    }

    public void setFarmingSeason(FarmingSeason farmingSeason) {
        this.farmingSeason = farmingSeason;
    }
}
