package com.Farm.NASMS.Service;

import com.Farm.NASMS.MarketTransaction;
import com.Farm.NASMS.Repository.MarketTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketTransactionImpl implements MarketTransactionService{
    private MarketTransactionRepository marketTransactionRepository;
    public MarketTransactionImpl(MarketTransactionRepository marketTransactionRepository){
        this.marketTransactionRepository = marketTransactionRepository;
    }

    @Override
    public MarketTransaction createTransaction(MarketTransaction transaction) {
        return marketTransactionRepository.save(transaction);
    }

    @Override
    public List<MarketTransaction> getAllTransactions() {
        return marketTransactionRepository.findAll();
    }

    @Override
    public List<MarketTransaction> getTransactionBySellerId(Long sellerId) {
        return marketTransactionRepository.findBySellerId(sellerId);
    }

    @Override
    public List<MarketTransaction> getTransactionByBuyerId(Long buyerId) {
        return marketTransactionRepository.findByBuyerId(buyerId);
    }

    @Override
    public Optional<MarketTransaction> getTransactionByProductCode(String productCode) {
        return marketTransactionRepository.findByProductCode(productCode);
    }

    @Override
    public MarketTransaction updateTransaction(MarketTransaction marketTransaction) {
        return marketTransactionRepository.save(marketTransaction);
    }

    @Override
    public void deleteTransaction(String productCode) {
        marketTransactionRepository.deleteByProductCode(productCode);

    }
}
