package com.Farm.NASMS.Service;

import com.Farm.NASMS.LoanPayment;
import com.Farm.NASMS.PaymentMethod;
import com.Farm.NASMS.dto.LoanPaymentRequest;
import com.Farm.NASMS.dto.LoanPaymentResponse;

public interface LoanPaymentService {
LoanPaymentResponse makePayment(String loanCode, LoanPaymentRequest request);

}
