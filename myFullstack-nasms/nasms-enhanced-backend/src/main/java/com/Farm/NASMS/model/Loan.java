package com.Farm.NASMS.model;

import com.Farm.NASMS.enums.LoanStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
@Table(name = "loan")
@JsonIgnoreProperties({"loanPayments","hibernateLazyInitializer","handler"})
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id")
    @JsonIgnoreProperties({"loans","marketTransactions","loanPackages","hibernateLazyInitializer","handler"})
    private FarmingSeason farmingSeason;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loan_code")
    @JsonIgnoreProperties({"farmingSeason","hibernateLazyInitializer","handler"})
    private LoanPackage loanPackage;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoanPayment> loanPayments;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private double interestRate;

    @Column(nullable = false)
    private int durationMonths;

    private double        monthlyPenalty;
    private double        totalPayment;
    private LocalDateTime issuedDate;
    private LocalDateTime dueDate;
    private double        remainingBalance;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (issuedDate == null) issuedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    // ── Business logic ────────────────────────────────────────────────────────

    public static Loan createLoanFromPackage(Farmer farmer, LoanPackage pkg) {
        Loan loan = new Loan();
        loan.setFarmer(farmer);
        loan.setAmount(pkg.getAmount());
        loan.setInterestRate(pkg.getInterestRate());
        loan.setDurationMonths(pkg.getDurationMonths());
        loan.setMonthlyPenalty(pkg.getMonthlyPenalty());
        LocalDateTime now = LocalDateTime.now();
        loan.setIssuedDate(now);
        loan.setDueDate(now.plusMonths(pkg.getDurationMonths()));
        double time     = pkg.getDurationMonths() / 12.0;
        double interest = pkg.getAmount() * (pkg.getInterestRate() / 100.0) * time;
        loan.setTotalPayment(pkg.getAmount() + interest);
        loan.setStatus(LoanStatus.PENDING);
        return loan;
    }

    public double getRemainingBalance() {
        double paid = (loanPayments == null) ? 0 :
                loanPayments.stream().mapToDouble(LoanPayment::getTotalAmountPaid).sum();
        return totalPayment - paid;
    }

    public double calculatePenalty(LocalDateTime paymentDate) {
        if (dueDate != null && paymentDate != null && paymentDate.isAfter(dueDate)) {
            long monthsLate = ChronoUnit.MONTHS.between(dueDate, paymentDate);
            return monthsLate * monthlyPenalty;
        }
        return 0;
    }

    public double calculateTotalDue(LocalDateTime paymentDate) {
        return totalPayment + calculatePenalty(paymentDate);
    }

    public boolean isOverDue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && getRemainingBalance() > 0;
    }

    // ── Getters / setters ─────────────────────────────────────────────────────
    public Long           getId()                    { return id; }
    public void           setId(Long id)             { this.id = id; }
    public Farmer         getFarmer()                { return farmer; }
    public void           setFarmer(Farmer v)        { this.farmer = v; }
    public FarmingSeason  getFarmingSeason()         { return farmingSeason; }
    public void           setFarmingSeason(FarmingSeason v) { this.farmingSeason = v; }
    public LoanPackage    getLoanPackage()           { return loanPackage; }
    public void           setLoanPackage(LoanPackage v)  { this.loanPackage = v; }
    public List<LoanPayment> getLoanPayments()       { return loanPayments; }
    public void           setLoanPayments(List<LoanPayment> v) { this.loanPayments = v; }
    public double         getAmount()                { return amount; }
    public void           setAmount(double v)        { this.amount = v; }
    public double         getInterestRate()          { return interestRate; }
    public void           setInterestRate(double v)  { this.interestRate = v; }
    public int            getDurationMonths()        { return durationMonths; }
    public void           setDurationMonths(int v)   { this.durationMonths = v; }
    public double         getMonthlyPenalty()        { return monthlyPenalty; }
    public void           setMonthlyPenalty(double v){ this.monthlyPenalty = v; }
    public double         getTotalPayment()          { return totalPayment; }
    public void           setTotalPayment(double v)  { this.totalPayment = v; }
    public LocalDateTime  getIssuedDate()            { return issuedDate; }
    public void           setIssuedDate(LocalDateTime v) { this.issuedDate = v; }
    public LocalDateTime  getDueDate()               { return dueDate; }
    public void           setDueDate(LocalDateTime v){ this.dueDate = v; }
    public void           setRemainingBalance(double v) { this.remainingBalance = v; }
    public LoanStatus     getStatus()                { return status; }
    public void           setStatus(LoanStatus v)    { this.status = v; }
    public LocalDateTime  getCreatedAt()             { return createdAt; }
    public void           setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime  getUpdatedAt()             { return updatedAt; }
    public void           setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
}
