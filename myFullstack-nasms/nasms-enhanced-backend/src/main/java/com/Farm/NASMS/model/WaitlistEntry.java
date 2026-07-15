package com.Farm.NASMS.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist_entries")
public class WaitlistEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false)
    private String loanProductId;   // maps to LoanPackage.loanCode

    @Column(nullable = false)
    private String loanName;        // display name sent from the frontend

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    public WaitlistEntry() {}

    public Long getId() { return id; }

    public Farmer getFarmer() { return farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }

    public String getLoanProductId() { return loanProductId; }
    public void setLoanProductId(String loanProductId) { this.loanProductId = loanProductId; }

    public String getLoanName() { return loanName; }
    public void setLoanName(String loanName) { this.loanName = loanName; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}