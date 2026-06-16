package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.LoanPaymentRequest;
import com.Farm.NASMS.dto.LoanPaymentResponse;
import com.Farm.NASMS.enums.PaymentMethod;
import com.Farm.NASMS.model.LoanPayment;
import com.Farm.NASMS.service.LoanPaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan-payments")
public class LoanPaymentController {
    private LoanPaymentService loanPaymentService;
    public LoanPaymentController(LoanPaymentService loanPaymentService){
        this.loanPaymentService=loanPaymentService;
    }
    @PostMapping("/{loanCode}")
    public ResponseEntity<LoanPaymentResponse> payLoan(@PathVariable String loanCode, @RequestBody LoanPaymentRequest request){
        LoanPaymentResponse loanPayment = loanPaymentService.makePayment(loanCode,request);
        return ResponseEntity.ok(loanPayment);
    }
}
