package com.Farm.NASMS.Service;

import com.Farm.NASMS.MarketTransaction;
import java.util.Optional;
import org.springframework.stereotype.Service;

import java.util.List;

public interface MarketTransactionService {
MarketTransaction createTransaction(MarketTransaction transaction);
List <MarketTransaction>  getAllTransactions();
List<MarketTransaction> getTransactionBySellerId(Long sellerId);
List<MarketTransaction> getTransactionByBuyerId(Long buyerId);
Optional<MarketTransaction> getTransactionByProductCode(String productCode);
MarketTransaction updateTransaction(MarketTransaction marketTransaction);
void deleteTransaction(String productCode);
}
