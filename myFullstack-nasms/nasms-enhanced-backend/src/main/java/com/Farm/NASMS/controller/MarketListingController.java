package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.MarketListing;
import com.Farm.NASMS.service.MarketListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-list")
public class MarketListingController {

    private final MarketListingService service;

    public MarketListingController(MarketListingService service) {
        this.service = service;
    }

    /** POST /api/market-list */
    @PostMapping
    public ResponseEntity<MarketListing> create(@RequestBody MarketListing listing) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createList(listing));
    }

    /** GET /api/market-list/ */
    @GetMapping("/")
    public ResponseEntity<List<MarketListing>> getAll() {
        return ResponseEntity.ok(service.getAllListing());
    }

    /** GET /api/market-list/seller/{sellerId} */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<MarketListing> getBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(service.getProductBySellerId(sellerId));
    }

    /** GET /api/market-list/product/{productName} */
    @GetMapping("/product/{productName}")
    public ResponseEntity<MarketListing> getByName(@PathVariable String productName) {
        return ResponseEntity.ok(service.getProductByName(productName));
    }

    /** PUT /api/market-list/{productCode} */
    @PutMapping("/{productCode}")
    public ResponseEntity<MarketListing> update(@PathVariable String productCode,
                                                @RequestBody MarketListing listing) {
        return service.getProductByCode(productCode)
                .map(existing -> {
                    existing.setProductName(listing.getProductName());
                    existing.setQuantity(listing.getQuantity());
                    existing.setPrice(listing.getPrice());
                    existing.setSellerName(listing.getSellerName());
                    return ResponseEntity.ok(service.updateProductList(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/market-list/{productCode} — was missing the path variable binding */
    @DeleteMapping("/{productCode}")
    public ResponseEntity<Void> delete(@PathVariable String productCode) {
        service.deleteListing(productCode);
        return ResponseEntity.noContent().build();
    }
}
