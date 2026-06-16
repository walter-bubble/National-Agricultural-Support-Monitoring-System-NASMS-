package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.LoanPackage;
import com.Farm.NASMS.service.LoanPackageService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/loan-package")
public class LoanPackageController {
private LoanPackageService loanPackageService;
public LoanPackageController(LoanPackageService loanPackageService){
    this.loanPackageService=loanPackageService;
  }
@PostMapping
    public LoanPackage createLoanPackage(@RequestBody LoanPackage loanPackage){
    return loanPackageService.createLoanPackage(loanPackage);
  }
  @GetMapping
    public List<LoanPackage> getAllLoanPackage(){
    return loanPackageService.getAllLoanPackage();
  }
  @GetMapping("/{loanCode}")
    public LoanPackage getLoanPackageByCode(@PathVariable String loanCode){
    return loanPackageService.getLoanPackageByCode(loanCode);
  }
  @PutMapping("/{loanCode}")
  public LoanPackage updateLoanPackage(@PathVariable String loanCode,@RequestBody LoanPackage loanPackage){
    return loanPackageService.updateLoanPackage(loanCode,loanPackage);
  }
    @DeleteMapping("/{loanCode}")
    public void deleteLoanPackage(@PathVariable String loanCode){
    loanPackageService.deleteLoanPackage(loanCode);
  }
}
