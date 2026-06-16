package com.Farm.NASMS.service;

import com.Farm.NASMS.*;
import com.Farm.NASMS.enums.LoanStatus;
import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.model.LoanPackage;
import com.Farm.NASMS.repository.FarmerRepository;
import com.Farm.NASMS.repository.FarmingSeasonRepository;
import com.Farm.NASMS.repository.LoanPackageRepository;
import com.Farm.NASMS.repository.LoanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {
    private FarmerRepository farmerRepository;
    private LoanRepository loanRepository;
    private LoanPackageRepository loanPackageRepository;
    private FarmingSeasonRepository farmingSeasonRepository;
    public LoanServiceImpl(FarmerRepository farmerRepository, LoanRepository loanRepository,LoanPackageRepository loanPackageRepository,FarmingSeasonRepository farmingSeasonRepository){
        this.farmerRepository=farmerRepository;
        this.loanRepository=loanRepository;
        this.loanPackageRepository=loanPackageRepository;
        this.farmingSeasonRepository=farmingSeasonRepository;
    }
    @Override
    public Loan createLoanFromPackage(Long nationalId, String loanCode,Long seasonId) {
        Farmer farmer = farmerRepository.findByNationalId(nationalId)
                .orElseThrow(()->new RuntimeException("Farmer not found"));
        FarmingSeason season= farmingSeasonRepository.findById(seasonId)
                .orElseThrow(()->new RuntimeException("season not found!"));
        LoanPackage loanPackage=loanPackageRepository.findById(loanCode)
                .orElseThrow(()->new RuntimeException("loan package not found"));

        // closing of season
        if(season.shouldAutoClose()) {
            season.setClosed(true);
            farmingSeasonRepository.save(season);
        }
        //if season is still active
        if(!season.isActive()){
            throw new RuntimeException("Loans can only be applied during active season");
        }
        //check if loan limit has been exceeded for that season
        Double totalLoans = loanRepository.getTotalLoanAmountBySeason(season.getId());
        double total = (totalLoans == null) ? 0:totalLoans;
        if(total + loanPackage.getAmount() > season.getBudget()){
            throw new RuntimeException("season budget exceeded!");
        }
        //check if farmer has a lona already
        boolean exists = loanRepository.existsByFarmerAndFarmingSeason(farmer,season);
        if(exists){
            throw new RuntimeException("Farmer already has a loan in this season");
        }

        Loan loan = new Loan();
        loan.setFarmer(farmer);
        loan.setFarmingSeason(season);
        loan.setLoanPackage(loanPackage);
        loan.setAmount(loanPackage.getAmount());
        loan.setInterestRate(loanPackage.getInterestRate());
        loan.setMonthlyPenalty(loanPackage.getMonthlyPenalty());
       loan.setDurationMonths(loanPackage.getDurationMonths());


       LocalDateTime now = LocalDateTime.now();
       loan.setIssuedDate(now);
       LocalDateTime dueDate = now
               .plusMonths(loan.getDurationMonths());
       loan.setDueDate(dueDate);
       //calculate payment
        double time = loanPackage.getDurationMonths()/12.0;
        double interest = loanPackage.getAmount() * (loanPackage.getInterestRate()/100) * time;
        double totalPayment = loanPackage.getAmount() + interest;
        loan.setTotalPayment(totalPayment);
        loan.setStatus(LoanStatus.PENDING);
        return loanRepository.save(loan);
    }
    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Loan getLoansById(Long id) {
        return loanRepository.findById(id).orElseThrow(()->new RuntimeException("Loan not Found!"));
    }
    @Override
    public List<Loan> getLoansByFarmer(Long nationalId,String status) {
        return loanRepository.findByFarmerNationalIdAndStatus(nationalId,status);
    }
    @Override
    public Loan updateLoanStatus(String loanCode,String status) {
        Loan loan =loanRepository.findByLoanPackage_LoanCode(loanCode)
                .orElseThrow(()-> new RuntimeException("Loan not found!"));
        loan.setStatus(LoanStatus.valueOf(status.trim().toUpperCase()));
        return loanRepository.save(loan);

    }
    @Override
    public Loan payLoan(Long id){
        Loan loan = getLoansById(id);
        LocalDateTime dueDate =LocalDateTime.now();
        loan.setDueDate(dueDate);
        double totalDue = loan.calculateTotalDue(dueDate);
        loan.setTotalPayment(totalDue);
        loan.setStatus(LoanStatus.PENDING);
        return loanRepository.save(loan);
    }
    @Override
    public void deleteLoan(Long id) {
        //check if loan exists
        Loan loan = getLoansById(id);
        loanRepository.delete(loan);
    }
}
