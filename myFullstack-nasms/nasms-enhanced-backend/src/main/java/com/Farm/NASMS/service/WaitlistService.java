package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.WaitlistRequest;
import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.WaitlistEntry;
import com.Farm.NASMS.repository.FarmerRepository;
import com.Farm.NASMS.repository.WaitlistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class WaitlistService {

    private final WaitlistRepository waitlistRepo;
    private final FarmerRepository   farmerRepo;

    public WaitlistService(WaitlistRepository waitlistRepo, FarmerRepository farmerRepo) {
        this.waitlistRepo = waitlistRepo;
        this.farmerRepo   = farmerRepo;
    }

    public void join(String email, WaitlistRequest req) {
        Farmer farmer = farmerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for email: " + email));

        String productIdStr = String.valueOf(req.loanProductId());

        boolean already = waitlistRepo.existsByFarmerNationalIdAndLoanProductId(
                farmer.getNationalId(), productIdStr);
        if (already) return; // idempotent

        WaitlistEntry entry = new WaitlistEntry();
        entry.setFarmer(farmer);
        entry.setLoanProductId(productIdStr);
        entry.setLoanName(req.loanName());
        entry.setJoinedAt(LocalDateTime.now());
        waitlistRepo.save(entry);
    }
}
