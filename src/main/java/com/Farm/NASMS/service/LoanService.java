package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.ApplyRequest;
import com.Farm.NASMS.dto.ApplicationResponse;
import com.Farm.NASMS.model.Loan;
import java.util.List;

public interface LoanService {
    <loan> Loan createLoanFromPackage(Long nationalId, String loanCode, Long seasonId);
    List<Loan> getAllLoans();
    Loan getLoansById(Long id);
    List<Loan> getLoansByFarmer(Long nationalId, String status);
    Loan updateLoanStatus(String loanCode, String status);
    Loan payLoan(Long id);
    void deleteLoan(Long id);

    // ── new: called by GET /api/loans/applications/me ──
    List<ApplicationResponse> getApplicationsByUsername(String username);

    // ── new: called by POST /api/loans/apply ──
    ApplicationResponse applyFromFrontend(String username, ApplyRequest request);
}