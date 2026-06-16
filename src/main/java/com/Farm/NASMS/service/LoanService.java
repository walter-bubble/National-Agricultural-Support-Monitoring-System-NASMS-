package com.Farm.NASMS.service;

import java.util.List;

import com.Farm.NASMS.model.Loan;

public interface LoanService {
    <loan> Loan createLoanFromPackage(Long nationalId, String loanCode,Long seasonId);
    List<Loan> getAllLoans();
    Loan getLoansById(Long id);
    List<Loan>getLoansByFarmer(Long nationalId,String status);
    Loan updateLoanStatus(String loanCode, String status);
    Loan payLoan(Long id);
    void deleteLoan(Long id);
}
