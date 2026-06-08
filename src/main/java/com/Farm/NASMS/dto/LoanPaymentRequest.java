package com.Farm.NASMS.dto;

import com.Farm.NASMS.PaymentMethod;

public class LoanPaymentRequest {
    private double amountToPay;
    private PaymentMethod paymentMethod;

    public double getAmountToPay() {
        return amountToPay;
    }

    public void setAmountToPay(double amountToPay) {
        this.amountToPay = amountToPay;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
