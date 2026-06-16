package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Farm.NASMS.model.MarketListing;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketListingRepository extends JpaRepository<MarketListing,Long> {
    List<MarketListing>findBySellerId(Long sellerId);
    List<MarketListing>findByProductName(String productName);
    Optional<MarketListing> findByProductCode(String productCode);
    void deleteByProductCode(String productCode);
}
