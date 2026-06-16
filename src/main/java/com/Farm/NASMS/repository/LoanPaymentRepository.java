package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.model.LoanPayment;

import java.util.List;

public interface LoanPaymentRepository extends JpaRepository <LoanPayment,Long> {
    List<LoanPayment> findByLoan(Loan loan);
}
