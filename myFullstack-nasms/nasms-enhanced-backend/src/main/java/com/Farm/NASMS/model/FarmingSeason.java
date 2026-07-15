package com.Farm.NASMS.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "farming_season")
@JsonIgnoreProperties({"loans","marketTransactions","loanPackages","hibernateLazyInitializer","handler"})
public class FarmingSeason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String    seasonName;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean   closed = false;
    private double    budget;

    public boolean isActive() {
        if (closed || startDate == null || endDate == null) return false;
        LocalDate today = LocalDate.now();
        return !today.isBefore(startDate) && !today.isAfter(endDate);
    }

    public boolean shouldAutoClose() {
        return endDate != null && LocalDate.now().isAfter(endDate);
    }

    // Getters / setters
    public Long      getId()                      { return id; }
    public void      setId(Long id)               { this.id = id; }
    public String    getSeasonName()              { return seasonName; }
    public void      setSeasonName(String v)      { this.seasonName = v; }
    public LocalDate getStartDate()               { return startDate; }
    public void      setStartDate(LocalDate v)    { this.startDate = v; }
    public LocalDate getEndDate()                 { return endDate; }
    public void      setEndDate(LocalDate v)      { this.endDate = v; }
    public boolean   isClosed()                   { return closed; }
    public void      setClosed(boolean v)         { this.closed = v; }
    public double    getBudget()                  { return budget; }
    public void      setBudget(double v)          { this.budget = v; }
}
