package com.Farm.NASMS.dto;

import com.Farm.NASMS.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class LoanPaymentRequest {
    @Positive(message = "Amount to pay must be positive")
    private double amountToPay;

    @NotNull(message = "Payment method is required")
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
