package com.Farm.NASMS.repository;

import com.Farm.NASMS.model.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    boolean existsByFarmerNationalIdAndLoanProductId(Long nationalId, String loanProductId);
}