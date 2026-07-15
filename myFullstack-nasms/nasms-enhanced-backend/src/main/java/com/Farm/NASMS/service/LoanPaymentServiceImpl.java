package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.LoanPaymentRequest;
import com.Farm.NASMS.dto.LoanPaymentResponse;
import com.Farm.NASMS.enums.LoanStatus;
import com.Farm.NASMS.enums.PaymentMethod;
import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.model.LoanPayment;
import com.Farm.NASMS.repository.LoanPaymentRepository;
import com.Farm.NASMS.repository.LoanRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static java.lang.Long.sum;

@Service
public class LoanPaymentServiceImpl implements LoanPaymentService {
    private LoanPaymentRepository loanPaymentRepository;
    private LoanRepository loanRepository;
    public LoanPaymentServiceImpl(LoanPaymentRepository loanPaymentRepository,LoanRepository loanRepository){
        this.loanPaymentRepository=loanPaymentRepository;
        this.loanRepository=loanRepository;
    }
    @Override
    @Transactional
    public LoanPaymentResponse makePayment(String loanCode, LoanPaymentRequest request) {
        Loan loan = loanRepository.findByLoanPackage_LoanCode(loanCode)
                .orElseThrow(() -> new RuntimeException("loan does not exist"));
        double amount = request.getAmountToPay();
        PaymentMethod paymentMethod = request.getPaymentMethod();
        if (amount <= 0) {
            throw new RuntimeException("amount to pay can't be zero!");
        }
        if (loan.getRemainingBalance() <= 0) {
            throw new RuntimeException("Loan already repaid");
        }
        if (amount > loan.getRemainingBalance()) {
            throw new RuntimeException("The amount to pay exceeds the remaining balance");
        }
        LoanPayment payment = new LoanPayment();
        payment.setLoan(loan);
        payment.setPaymentMethod(paymentMethod);
        payment.setAmountToPay(amount);
        payment.setPaymentDate(LocalDateTime.now());
        //payment.setTransactionCode();

        double newBalance = loan.getRemainingBalance() - amount;
        loan.setRemainingBalance(newBalance);
        payment.setRemainingBalance(newBalance);

        if (newBalance == 0) {
            loan.setStatus(LoanStatus.COMPLETED);
        }
        loanRepository.save(loan);
        LoanPayment saved = loanPaymentRepository.save(payment);

        double previousTotal = loanPaymentRepository
                .findByLoan(loan)
                .stream()
                .mapToDouble(LoanPayment::getAmountToPay)
                .sum();
        double totalAmountPaid = previousTotal + amount;


        LoanPaymentResponse response = new LoanPaymentResponse();
        response.setAmountToPay(saved.getAmountToPay());
        response.setTotalAmountPaid(saved.getTotalAmountPaid());
        response.setRemainingBalance(saved.getRemainingBalance());
        response.setPaymentDate(saved.getPaymentDate());
        response.setTransactionCode(saved.getTransactionCode());
        response.setPaymentMethod(saved.getPaymentMethod());

        return response;
    }
}
