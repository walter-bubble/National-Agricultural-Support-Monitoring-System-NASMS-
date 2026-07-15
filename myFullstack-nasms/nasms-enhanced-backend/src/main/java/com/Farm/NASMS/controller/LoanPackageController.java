package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.LoanPackage;
import com.Farm.NASMS.service.LoanPackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-package")
public class LoanPackageController {

    private final LoanPackageService service;

    public LoanPackageController(LoanPackageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoanPackage> create(@RequestBody LoanPackage pkg) {
        return ResponseEntity.ok(service.createLoanPackage(pkg));
    }

    @GetMapping
    public List<LoanPackage> getAll() {
        return service.getAllLoanPackage();
    }

    @GetMapping("/{loanCode}")
    public LoanPackage getByCode(@PathVariable String loanCode) {
        return service.getLoanPackageByCode(loanCode);
    }

    @PutMapping("/{loanCode}")
    public LoanPackage update(@PathVariable String loanCode,
                              @RequestBody LoanPackage pkg) {
        return service.updateLoanPackage(loanCode, pkg);
    }

    @DeleteMapping("/{loanCode}")
    public ResponseEntity<Void> delete(@PathVariable String loanCode) {
        service.deleteLoanPackage(loanCode);
        return ResponseEntity.noContent().build();
    }
}
