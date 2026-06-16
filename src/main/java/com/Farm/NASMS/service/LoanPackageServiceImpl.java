package com.Farm.NASMS.service;

import com.Farm.NASMS.model.LoanPackage;
import com.Farm.NASMS.repository.LoanPackageRepository;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoanPackageServiceImpl implements LoanPackageService {
    private LoanPackageRepository loanPackageRepository;
    public LoanPackageServiceImpl(LoanPackageRepository loanPackageRepository){
        this.loanPackageRepository=loanPackageRepository;
    }
    @Override
    public LoanPackage createLoanPackage(LoanPackage loanPackage) {
        return loanPackageRepository.save(loanPackage);
    }
    @Override
    public List<LoanPackage> getAllLoanPackage() {
        return loanPackageRepository.findAll();
    }
    @Override
    public LoanPackage getLoanPackageByCode(String loanCode) {
        return loanPackageRepository.findById(loanCode)
                .orElseThrow(()->new RuntimeException("Loan Package not found!"));
    }
    @Override
    public LoanPackage updateLoanPackage(String loanCode,LoanPackage loanPackage){
        LoanPackage existing = getLoanPackageByCode(loanCode);
        existing.setAmount(loanPackage.getAmount());
        existing.setInterestRate(loanPackage.getInterestRate());
        existing.setDurationMonths(loanPackage.getDurationMonths());
        existing.setMonthlyPenalty(loanPackage.getMonthlyPenalty());
        existing.setDescription(loanPackage.getDescription());
        return loanPackageRepository.save(existing);
    }
    @Override
    public void deleteLoanPackage(String loanCode) {
        LoanPackage existing=getLoanPackageByCode(loanCode);
        loanPackageRepository.delete(existing);
    }
}
