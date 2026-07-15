package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.ApplyRequest;
import com.Farm.NASMS.dto.ApplicationResponse;
import com.Farm.NASMS.dto.WaitlistRequest;
import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.service.LoanService;
import com.Farm.NASMS.service.WaitlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService     loanService;
    private final WaitlistService waitlistService;

    public LoanController(LoanService loanService, WaitlistService waitlistService) {
        this.loanService     = loanService;
        this.waitlistService = waitlistService;
    }

    /** GET /api/loans — admin: all loans */
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    /** GET /api/loans/{id} */
    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoansById(id);
    }

    /** GET /api/loans/farmer/{nationalId} */
    @GetMapping("/farmer/{nationalId}")
    public List<Loan> getLoansByFarmer(@PathVariable Long nationalId,
                                       @RequestParam(required = false) String status) {
        return loanService.getLoansByFarmer(nationalId, status != null ? status.toUpperCase() : null);
    }

    /**
     * PUT /api/loans/{id}/status
     * Body: { "status": "APPROVED" | "REJECTED" | "COMPLETED" | "PENDING" }
     * Used by admin to approve / reject loans.
     */
    @PutMapping("/{id}/status")
    public Loan updateStatus(@PathVariable Long id,
                             @RequestBody Map<String, String> body) {
        return loanService.updateLoanStatus(id, body.get("status"));
    }

    /** PUT /api/loans/{id}/pay */
    @PutMapping("/{id}/pay")
    public Loan payLoan(@PathVariable Long id) {
        return loanService.payLoan(id);
    }

    /** DELETE /api/loans/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/loans/applications/me — farmer: own loan history */
    @GetMapping("/applications/me")
    public List<ApplicationResponse> getMyApplications(
            @AuthenticationPrincipal String email) {
        return loanService.getApplicationsByUsername(email);
    }

    /** POST /api/loans/apply — farmer applies for a loan */
    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> apply(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ApplyRequest request) {
        ApplicationResponse created = loanService.applyFromFrontend(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** POST /api/loans/waitlist — farmer joins waitlist */
    @PostMapping("/waitlist")
    public ResponseEntity<Void> joinWaitlist(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody WaitlistRequest request) {
        waitlistService.join(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
