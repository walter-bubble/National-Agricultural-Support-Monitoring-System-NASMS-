package com.Farm.NASMS.service;

import java.util.List;

import com.Farm.NASMS.model.LoanPackage;

public interface LoanPackageService {
LoanPackage createLoanPackage(LoanPackage loanPackage);
List<LoanPackage>getAllLoanPackage();
LoanPackage getLoanPackageByCode(String loanCode);
void deleteLoanPackage(String loanCode);
LoanPackage updateLoanPackage(String loanCode,LoanPackage loanPackage);
}
