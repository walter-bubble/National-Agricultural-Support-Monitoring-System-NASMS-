package com.Farm.NASMS.repository;

import com.Farm.NASMS.model.MarketListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarketListingRepository extends JpaRepository<MarketListing, Long> {
    Optional<MarketListing> findByProductCode(String productCode);
    Optional<MarketListing> findBySellerId(Long sellerId);
    Optional<MarketListing> findByProductName(String productName);
    List<MarketListing> findAllByOrderByCreatedDesc();
}
