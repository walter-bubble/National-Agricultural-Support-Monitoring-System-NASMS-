package com.Farm.NASMS.repository;

import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    /**
     * When status is null, returns ALL loans for the farmer.
     * When status is provided, filters by exact string match on the enum name.
     */
    @Query("SELECT l FROM Loan l WHERE l.farmer.nationalId = :nationalId " +
           "AND (:status IS NULL OR CAST(l.status AS string) = :status)")
    List<Loan> findByFarmerNationalIdAndStatus(
            @Param("nationalId") Long nationalId,
            @Param("status")     String status);

    Optional<Loan> findByLoanPackage_LoanCode(String loanCode);

    @Query("SELECT COALESCE(SUM(l.amount), 0) FROM Loan l WHERE l.farmingSeason.id = :seasonId")
    Double getTotalLoanAmountBySeason(@Param("seasonId") Long seasonId);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.farmingSeason.id = :seasonId")
    Long countLoansBySeason(@Param("seasonId") Long seasonId);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.farmingSeason.id = :seasonId AND l.status = 'APPROVED'")
    Long countApprovedLoans(@Param("seasonId") Long seasonId);

    boolean existsByFarmerAndFarmingSeason(Farmer farmer, FarmingSeason season);
}
