package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.service.LoanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    @Autowired
    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }
    //create loan
    @PostMapping("/farmer/{nationalId}/package/{loanCode}/season/{seasonId}")
        public Loan createLoan(@PathVariable Long nationalId,@PathVariable String loanCode,
                               @PathVariable Long seasonId){
            return loanService.createLoanFromPackage(nationalId,loanCode,seasonId);
        }
        //get list of loans
        @GetMapping
    public List<Loan> getAllLoans(){
        return loanService.getAllLoans();
        }
        //select loan
        @GetMapping("/{id}")
    public Loan getLoansById(@PathVariable Long id){
        return loanService.getLoansById(id);
        }
        //get the loan
    @GetMapping("/farmer/national{NationalId}")
    public List<Loan> getLoansByFarmerNationalId(@PathVariable Long nationalId,
                                                 @RequestParam(required = false)
                                                 String status) {
        if (status == null) {
            return loanService.getLoansByFarmer(nationalId, null);
        } else {
            return loanService.getLoansByFarmer(nationalId, status.toUpperCase());
        }
    }
    //update the loan
    @PutMapping("/{loanCode}/status")
    public Loan updateLoanByFarmer(@PathVariable String loanCode,@RequestBody Map<String,String> request){
        return loanService.updateLoanStatus(loanCode, request.get("status"));
    }
    //payLoan
    @PutMapping("/{id}/pay")
    public Loan payLoan(@PathVariable Long id){
        return loanService.payLoan(id);

    }
    //delete loan
    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id){
        loanService.deleteLoan(id);
    }
}
