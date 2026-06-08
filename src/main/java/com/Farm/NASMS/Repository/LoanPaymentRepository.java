package com.Farm.NASMS.Repository;

import com.Farm.NASMS.Loan;
import com.Farm.NASMS.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanPaymentRepository extends JpaRepository <LoanPayment,Long> {
    List<LoanPayment> findByLoan(Loan loan);
}
