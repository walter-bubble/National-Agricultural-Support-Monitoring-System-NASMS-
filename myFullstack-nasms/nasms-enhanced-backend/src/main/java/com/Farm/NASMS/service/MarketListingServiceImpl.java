package com.Farm.NASMS.service;

import com.Farm.NASMS.model.MarketListing;
import com.Farm.NASMS.repository.MarketListingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketListingServiceImpl implements MarketListingService {

    private final MarketListingRepository repo;

    public MarketListingServiceImpl(MarketListingRepository repo) {
        this.repo = repo;
    }

    @Override
    public MarketListing createList(MarketListing listing) {
        return repo.save(listing);
    }

    @Override
    public List<MarketListing> getAllListing() {
        return repo.findAllByOrderByCreatedDesc();
    }

    @Override
    public Optional<MarketListing> getProductByCode(String productCode) {
        return repo.findByProductCode(productCode);
    }

    @Override
    public MarketListing getProductBySellerId(Long sellerId) {
        return repo.findBySellerId(sellerId)
                .orElseThrow(() -> new RuntimeException("No listing for seller " + sellerId));
    }

    @Override
    public MarketListing getProductByName(String productName) {
        return repo.findByProductName(productName)
                .orElseThrow(() -> new RuntimeException("Listing not found: " + productName));
    }

    @Override
    public MarketListing updateProductList(MarketListing listing) {
        return repo.save(listing);
    }

    @Override
    public void deleteListing(String productCode) {
        repo.findByProductCode(productCode).ifPresent(repo::delete);
    }
}
