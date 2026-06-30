package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.ApplyRequest;
import com.Farm.NASMS.dto.ApplicationResponse;
import com.Farm.NASMS.dto.WaitlistRequest;
import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.service.LoanService;
import com.Farm.NASMS.service.WaitlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final WaitlistService waitlistService;

    @Autowired
    public LoanController(LoanService loanService, WaitlistService waitlistService) {
        this.loanService = loanService;
        this.waitlistService = waitlistService;
    }

    // ─── Existing endpoints ───────────────────────────────────────────────────

    @PostMapping("/farmer/{nationalId}/package/{loanCode}/season/{seasonId}")
    public Loan createLoan(@PathVariable Long nationalId,
                           @PathVariable String loanCode,
                           @PathVariable Long seasonId) {
        return loanService.createLoanFromPackage(nationalId, loanCode, seasonId);
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/{id}")
    public Loan getLoansById(@PathVariable Long id) {
        return loanService.getLoansById(id);
    }

    @GetMapping("/farmer/{nationalId}")
    public List<Loan> getLoansByFarmerNationalId(@PathVariable Long nationalId,
                                                 @RequestParam(required = false) String status) {
        return loanService.getLoansByFarmer(nationalId, status != null ? status.toUpperCase() : null);
    }

    @PutMapping("/{loanCode}/status")
    public Loan updateLoanByFarmer(@PathVariable String loanCode,
                                   @RequestBody Map<String, String> request) {
        return loanService.updateLoanStatus(loanCode, request.get("status"));
    }

    @PutMapping("/{id}/pay")
    public Loan payLoan(@PathVariable Long id) {
        return loanService.payLoan(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }

    // ─── New endpoints for the frontend ──────────────────────────────────────

    @GetMapping("/applications/me")
    public List<ApplicationResponse> getMyApplications(
            @AuthenticationPrincipal String email) {
        return loanService.getApplicationsByUsername(email);
    }

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> apply(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ApplyRequest request) {
        ApplicationResponse created = loanService.applyFromFrontend(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/waitlist")
    public ResponseEntity<Void> joinWaitlist(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody WaitlistRequest request) {
        waitlistService.join(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}