package com.Farm.NASMS.Controller;

import com.Farm.NASMS.MarketListing;
import com.Farm.NASMS.Service.MarketListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-list")
public class MarketListingController {
    private MarketListingService marketListingService;
    public MarketListingController(MarketListingService marketListingService){
        this.marketListingService=marketListingService;
    }
    @PostMapping
    public ResponseEntity<MarketListing> createList(@RequestBody MarketListing listing){
        return ResponseEntity.ok(marketListingService.createList (listing));
    }
    @GetMapping("/")
    public ResponseEntity<List<MarketListing>> getAllListing(){
        return ResponseEntity.ok(marketListingService.getAllListing());
    }
    /* GetMapping("/product/{productCode}")
        public ResponseEntity<List<MarketListing>> getProductByCode(@PathVariable String productCode){
        return ResponseEntity.ok(marketListingService.getProductByCode(productCode));
    }*/
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<MarketListing> getProductBySellerId(@PathVariable Long sellerId){
        return ResponseEntity.ok(marketListingService.getProductBySellerId(sellerId));
    }
    @GetMapping("/product/{productName}")
    public ResponseEntity<MarketListing> getProductByName(@PathVariable String productName){
        return ResponseEntity.ok(marketListingService.getProductByName(productName));
    }
    @PutMapping("/{productCode}")
    public ResponseEntity<MarketListing> updateProductList(@PathVariable String productCode, MarketListing listing){
        return marketListingService.getProductByCode(productCode).map(existing->{
            existing.setProductName(listing.getProductName());
            existing.setProductCode(listing.getProductCode());
            existing.setQuantity(listing.getQuantity());
            existing.setPrice(listing.getPrice());
            MarketListing updated=marketListingService.updateProductList(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/productCode")
    public ResponseEntity<Void> deleteListing(@PathVariable String productCode){
        marketListingService.deleteListing(productCode);
        return ResponseEntity.noContent().build();
    }
}
