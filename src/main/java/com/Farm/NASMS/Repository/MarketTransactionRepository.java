package com.Farm.NASMS.Repository;

import com.Farm.NASMS.MarketTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketTransactionRepository extends JpaRepository<MarketTransaction, Long> {
    List<MarketTransaction>findBySellerId(Long sellerId);
    List<MarketTransaction>findByBuyerId(Long buyerId);
    Optional<MarketTransaction> findByProductCode(String productCode);
    void deleteByProductCode(String productCode);

    @Query("SELECT SUM(m.quantity* m.price) FROM MarketTransaction m WHERE m.season.Id= :seasonId")
    double getTotalSalesBySeason(@Param("seasonId") Long seasonId);
}
