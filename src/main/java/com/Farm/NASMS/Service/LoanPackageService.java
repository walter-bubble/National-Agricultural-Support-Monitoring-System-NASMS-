package com.Farm.NASMS.Service;

import com.Farm.NASMS.LoanPackage;

import java.util.List;

public interface LoanPackageService {
LoanPackage createLoanPackage(LoanPackage loanPackage);
List<LoanPackage>getAllLoanPackage();
LoanPackage getLoanPackageByCode(String loanCode);
void deleteLoanPackage(String loanCode);
LoanPackage updateLoanPackage(String loanCode,LoanPackage loanPackage);
}
