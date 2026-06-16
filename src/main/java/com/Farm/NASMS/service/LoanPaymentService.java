package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.LoanPaymentRequest;
import com.Farm.NASMS.dto.LoanPaymentResponse;
import com.Farm.NASMS.enums.PaymentMethod;
import com.Farm.NASMS.model.LoanPayment;

public interface LoanPaymentService {
LoanPaymentResponse makePayment(String loanCode, LoanPaymentRequest request);

}
