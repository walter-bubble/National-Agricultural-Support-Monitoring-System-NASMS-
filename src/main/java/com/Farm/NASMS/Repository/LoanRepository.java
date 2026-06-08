package com.Farm.NASMS.Repository;

import com.Farm.NASMS.Farmer;
import com.Farm.NASMS.FarmingSeason;
import com.Farm.NASMS.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoanRepository  extends JpaRepository<Loan, Long> {
    List<Loan> findByFarmerNationalIdAndStatus(Long nationalId,String status);
    Optional<Loan>findByLoanPackage_LoanCode(String loanCode);
    @Query("SELECT COUNT(1) FROM Loan l WHERE l.farmingSeason.id=:seasonId")
    Long countLoansBySeason(@Param("seasonId")Long seasonId);

    @Query("SELECT COUNT(1) FROM Loan l WHERE l.farmingSeason.id=:seasonId AND l.status='Approved'")
    Long countApprovedLoans(@Param("seasonId") Long seasonId);

    @Query("SELECT SUM(l.amount) FROM Loan l WHERE l.farmingSeason.id=:seasonId")
    Double getTotalLoanAmountBySeason(@Param("seasonId") Long seasonId);

    boolean existsByFarmerAndFarmingSeason(Farmer farmer, FarmingSeason season);
}
