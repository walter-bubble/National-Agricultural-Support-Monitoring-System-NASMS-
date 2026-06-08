package com.Farm.NASMS.Controller;

import com.Farm.NASMS.LoanPayment;
import com.Farm.NASMS.PaymentMethod;
import com.Farm.NASMS.Service.LoanPaymentService;
import com.Farm.NASMS.dto.LoanPaymentRequest;
import com.Farm.NASMS.dto.LoanPaymentResponse;
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
