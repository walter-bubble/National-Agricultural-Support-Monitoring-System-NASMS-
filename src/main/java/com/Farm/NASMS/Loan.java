package com.Farm.NASMS;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;//for loan records

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")//connect to farmer table
    private Farmer farmer;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="season_id")
    private FarmingSeason farmingSeason;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="loan_code")
    private LoanPackage loanPackage;

    @OneToMany(mappedBy = "loan",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<LoanPayment> loanPayments;

    //loan details
    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private double interestRate;

    @Column(nullable = false)
    private int durationMonths;

    private double monthlyPenalty;
    private double totalPayment;
    private LocalDateTime issuedDate;
    private LocalDateTime dueDate;
    private double remainingBalance;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    //Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //the life cycle
    @PrePersist
    protected void onCreate(){
        createdAt=LocalDateTime.now();
        if(issuedDate==null){
            issuedDate=LocalDateTime.now();
        }
    }
    @PreUpdate
    protected void onUpdate(){
        updatedAt=LocalDateTime.now();
    }

    //business logic here
    public Loan(){}
    public static Loan createLoanFromPackage(Farmer farmer, LoanPackage loanPackage) {
        Loan loan = new Loan();
        loan.setFarmer(farmer);

        loan.setAmount(loanPackage.getAmount());
        loan.setInterestRate(loanPackage.getInterestRate());
        loan.setDurationMonths(loanPackage.getDurationMonths());
        loan.setMonthlyPenalty(loanPackage.getMonthlyPenalty());
        loan.setTotalPayment(calculateTotalPayment(loan));

        LocalDateTime now = LocalDateTime.now();
        loan.setIssuedDate(now);
        loan.setDueDate(now.plusMonths(loanPackage.getDurationMonths()));
        loan.setStatus(LoanStatus.PENDING);
        return loan;
    }
    private static double calculateTotalPayment(Loan loan){
        return loan.getAmount() + (loan.getAmount()*loan.getInterestRate()/100*loan.getDurationMonths()/12);
    }
    public double getRemainingBalance(){
        double paid=(loanPayments==null) ? 0:
                loanPayments.stream().mapToDouble(LoanPayment:: getTotalAmountPaid).sum();
        return totalPayment-paid;
    }
    public double calculatePenalty(LocalDateTime dueDate){
        if(dueDate != null && dueDate.isAfter(this.dueDate)){
            long monthsLate = ChronoUnit.MONTHS.between(this.dueDate,dueDate);
            return monthsLate * monthlyPenalty;
        }
        return 0;
    }
    public double calculateTotalDue(LocalDateTime paymentDate){
        return this.totalPayment + calculatePenalty(paymentDate);
    }
    public boolean isOverDue(){
        return LocalDateTime.now().isAfter(dueDate) && getRemainingBalance()>0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Farmer getFarmer() {
        return farmer;
    }

    public void setFarmer(Farmer farmer) {
        this.farmer = farmer;
    }

    public LoanPackage getLoanPackage() {
        return loanPackage;
    }

    public void setLoanPackage(LoanPackage loanPackage) {
        this.loanPackage = loanPackage;
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

    public double getMonthlyPenalty() {
        return monthlyPenalty;
    }

    public void setMonthlyPenalty(double monthlyPenalty) {
        this.monthlyPenalty = monthlyPenalty;
    }
    public int getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(int durationMonths) {
        this.durationMonths = durationMonths;
    }

    public LocalDateTime getIssuedDate() {
        return issuedDate;
    }

    public void setIssuedDate(LocalDateTime issuedDate) {
        this.issuedDate = issuedDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    public double getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(double totalPayment) {
        this.totalPayment = totalPayment;
    }

    public FarmingSeason getFarmingSeason() {
        return farmingSeason;
    }

    public void setFarmingSeason(FarmingSeason farmingSeason) {
        this.farmingSeason = farmingSeason;
    }

    public List<LoanPayment> getLoanPayments() {
        return loanPayments;
    }

    public void setLoanPayments(List<LoanPayment> loanPayments) {
        this.loanPayments = loanPayments;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setRemainingBalance(double remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

}