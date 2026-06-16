package com.Farm.NASMS.service;

import java.util.List;
import java.util.Optional;

import com.Farm.NASMS.model.MarketListing;

public interface MarketListingService {
    MarketListing createList(MarketListing listing);
    List<MarketListing> getAllListing();

    Optional<MarketListing> getProductByCode(String productCode);
    MarketListing getProductBySellerId(Long sellerId);
    MarketListing getProductByName(String productName);
    MarketListing updateProductList(MarketListing listing);
    void deleteListing(String productCode);
}

