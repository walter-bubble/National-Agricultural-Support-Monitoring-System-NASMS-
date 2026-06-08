package com.Farm.NASMS.Repository;

import com.Farm.NASMS.MarketListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketListingRepository extends JpaRepository<MarketListing,Long> {
    List<MarketListing>findBySellerId(Long sellerId);
    List<MarketListing>findByProductName(String productName);
    Optional<MarketListing> findByProductCode(String productCode);
    void deleteByProductCode(String productCode);
}
