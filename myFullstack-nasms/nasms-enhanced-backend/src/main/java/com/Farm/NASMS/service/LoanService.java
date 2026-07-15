package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.ApplyRequest;
import com.Farm.NASMS.dto.ApplicationResponse;
import com.Farm.NASMS.model.Loan;

import java.util.List;

public interface LoanService {
    Loan createLoanFromPackage(Long nationalId, String loanCode, Long seasonId);
    List<Loan> getAllLoans();
    Loan getLoansById(Long id);
    List<Loan> getLoansByFarmer(Long nationalId, String status);
    Loan updateLoanStatus(Long id, String status);
    Loan payLoan(Long id);
    void deleteLoan(Long id);
    List<ApplicationResponse> getApplicationsByUsername(String email);
    ApplicationResponse applyFromFrontend(String email, ApplyRequest request);
}
