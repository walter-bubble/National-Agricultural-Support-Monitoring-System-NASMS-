package com.Farm.NASMS.service;

import com.Farm.NASMS.model.MarketListing;
import com.Farm.NASMS.repository.MarketListingRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketListingServiceImpl implements MarketListingService{
  private MarketListingRepository marketListingRepository;
  public MarketListingServiceImpl(MarketListingRepository marketListingRepository){
      this.marketListingRepository=marketListingRepository;
  }
    @Override
    public MarketListing createList(MarketListing listing) {
        return marketListingRepository.save(listing);
    }

    @Override
    public List<MarketListing> getAllListing() {
        return marketListingRepository.findAll();
    }

    @Override
    public Optional<MarketListing> getProductByCode(String productCode) {
        return marketListingRepository.findByProductCode(productCode);
    }

    @Override
    public MarketListing getProductBySellerId(Long sellerId) {
        return (MarketListing) marketListingRepository.findBySellerId(sellerId);
    }

    @Override
    public MarketListing getProductByName(String productName) {
        return (MarketListing) marketListingRepository.findByProductName(productName);
    }

    @Override
    public MarketListing updateProductList(MarketListing listing) {
        return marketListingRepository.save(listing);
    }

    @Override
    public void deleteListing(String productCode) {
        marketListingRepository.deleteByProductCode(productCode);

    }
}
