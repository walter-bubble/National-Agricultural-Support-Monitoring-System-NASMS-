package com.Farm.NASMS.Controller;


import com.Farm.NASMS.MarketTransaction;
import com.Farm.NASMS.Service.MarketTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market")
public class MarketController {
    private MarketTransactionService marketTransactionService;
    public MarketController(MarketTransactionService marketTransactionService){
        this.marketTransactionService=marketTransactionService;
    }
    @PostMapping("/transaction")
   public ResponseEntity<MarketTransaction>createTransaction(@RequestBody MarketTransaction transaction){
        MarketTransaction saved = marketTransactionService.createTransaction(transaction);
       return ResponseEntity.ok(saved);
    }
    @GetMapping("/transactions/")
    public ResponseEntity<List<MarketTransaction>> getAllTransactions(){
        List<MarketTransaction> transactions = marketTransactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<MarketTransaction>> getTransactionBySellerId(@PathVariable Long sellerId){
        List<MarketTransaction> list = marketTransactionService. getTransactionBySellerId(sellerId);
        return ResponseEntity.ok(list);
    }
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<MarketTransaction>> getTransactionByBuyerId(@PathVariable Long buyerId){
        List<MarketTransaction> list = marketTransactionService.getTransactionByBuyerId(buyerId);
        return ResponseEntity.ok(list);
    }
    @PutMapping("/transaction/{productCode}")
    public ResponseEntity<MarketTransaction> updateTransaction(@PathVariable String productCode, @RequestBody MarketTransaction transaction){
        return marketTransactionService.getTransactionByProductCode(productCode)
                .map(existing ->{
                    existing.setSellerId(transaction.getSellerId());
                    existing.setSellerType(transaction.getSellerType());
                    existing.setBuyerId(transaction.getBuyerId());
                    existing.setPrice(transaction.getPrice());
                    existing.setQuantity(transaction.getQuantity());
                    existing.setProductCode(transaction.getProductCode());
                    existing.setProductName(transaction.getProductName());
                    MarketTransaction updated = marketTransactionService.updateTransaction(existing);
                            return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/transaction/{productCode}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String productCode){
        marketTransactionService.deleteTransaction(productCode);
        return ResponseEntity.noContent().build();
    }
}
