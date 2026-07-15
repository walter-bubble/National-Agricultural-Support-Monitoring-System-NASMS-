package com.Farm.NASMS.dto;

public class SeasonComparisonDto {
    private String season1;
    private String season2;

    private double season1Sales;
    private double season2Sales;

    private double season1Farmers;
    private double season2Farmers;

    private double season1Loans;
    private double season2Loans;

    private double salesGrowthPercentage;
    private double farmersGrowthPercentage;
    private double loansGrowthPercentage;

    public SeasonComparisonDto(){

    }

    public String getSeason1() {
        return season1;
    }

    public void setSeason1(String season1) {
        this.season1 = season1;
    }

    public String getSeason2() {
        return season2;
    }

    public void setSeason2(String season2) {
        this.season2 = season2;
    }

    public double getSalesGrowthPercentage() {
        return salesGrowthPercentage;
    }

    public void setSalesGrowthPercentage(double salesGrowthPercentage) {
        this.salesGrowthPercentage = salesGrowthPercentage;
    }

    public double getFarmersGrowthPercentage() {
        return farmersGrowthPercentage;
    }

    public void setFarmersGrowthPercentage(double farmersGrowthPercentage) {
        this.farmersGrowthPercentage = farmersGrowthPercentage;
    }

    public double getLoansGrowthPercentage() {
        return loansGrowthPercentage;
    }

    public void setLoansGrowthPercentage(double loansGrowthPercentage) {
        this.loansGrowthPercentage = loansGrowthPercentage;
    }

    public double getSeason1Sales() {
        return season1Sales;
    }

    public void setSeason1Sales(double season1Sales) {
        this.season1Sales = season1Sales;
    }

    public double getSeason2Sales() {
        return season2Sales;
    }

    public void setSeason2Sales(double season2Sales) {
        this.season2Sales = season2Sales;
    }

    public double getSeason1Farmers() {
        return season1Farmers;
    }

    public void setSeason1Farmers(double season1Farmers) {
        this.season1Farmers = season1Farmers;
    }

    public double getSeason2Farmers() {
        return season2Farmers;
    }

    public void setSeason2Farmers(double season2Farmers) {
        this.season2Farmers = season2Farmers;
    }

    public double getSeason1Loans() {
        return season1Loans;
    }

    public void setSeason1Loans(double season1Loans) {
        this.season1Loans = season1Loans;
    }

    public double getSeason2Loans() {
        return season2Loans;
    }

    public void setSeason2Loans(double season2Loans) {
        this.season2Loans = season2Loans;
    }
}
