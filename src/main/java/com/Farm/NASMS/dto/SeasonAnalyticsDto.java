package com.Farm.NASMS.dto;

public class SeasonAnalyticsDto {
    private String seasonName;
    private Long totalFarmers;
    private Long totalLoans;
    private Long approvedLoans;
    private Long rejectedLoans;
    private double totalSupportFunds;
    private double totalSales;
    private double totalLoanAmount;
    private double remainingBudget;
    private double loanUtilizationRate;

    public SeasonAnalyticsDto(){

    }

    public String getSeasonName() {
        return seasonName;
    }

    public void setSeasonName(String seasonName) {
        this.seasonName = seasonName;
    }

    public Long getTotalFarmers() {
        return totalFarmers;
    }

    public void setTotalFarmers(Long totalFarmers) {
        this.totalFarmers = totalFarmers;
    }

    public Long getTotalLoans() {
        return totalLoans;
    }

    public void setTotalLoans(Long totalLoans) {
        this.totalLoans = totalLoans;
    }

    public double getTotalSupportFunds() {
        return totalSupportFunds;
    }

    public void setTotalSupportFunds(double totalSupportFunds) {
        this.totalSupportFunds = totalSupportFunds;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }

    public Long getApprovedLoans() {
        return approvedLoans;
    }

    public void setApprovedLoans(Long approvedLoans) {
        this.approvedLoans = approvedLoans;
    }

    public Long getRejectedLoans() {
        return rejectedLoans;
    }

    public void setRejectedLoans(Long rejectedLoans) {
        this.rejectedLoans = rejectedLoans;
    }

    public double getTotalLoanAmount() {
        return totalLoanAmount;
    }

    public void setTotalLoanAmount(double totalLoanAmount) {
        this.totalLoanAmount = totalLoanAmount;
    }

    public double getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(double remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public double getLoanUtilizationRate() {
        return loanUtilizationRate;
    }

    public void setLoanUtilizationRate(double loanUtilizationRate) {
        this.loanUtilizationRate = loanUtilizationRate;
    }
}
