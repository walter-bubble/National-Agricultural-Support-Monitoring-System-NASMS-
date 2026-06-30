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

    private final WaitlistRepository waitlistRepository;
    private final FarmerRepository farmerRepository;

    public WaitlistService(WaitlistRepository waitlistRepository,
                           FarmerRepository farmerRepository) {
        this.waitlistRepository = waitlistRepository;
        this.farmerRepository = farmerRepository;
    }

    /**
     * Adds the farmer (looked up by email from the JWT subject) to the
     * waitlist for a loan product that is currently not open.
     * Idempotent — calling it twice for the same farmer + product is safe.
     */
    public void join(String email, WaitlistRequest request) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for email: " + email));

        boolean alreadyJoined = waitlistRepository
                .existsByFarmerNationalIdAndLoanProductId(
                        farmer.getNationalId(), String.valueOf(request.loanProductId()));

        if (alreadyJoined) return; // silently succeed — frontend can retry safely

        WaitlistEntry entry = new WaitlistEntry();
        entry.setFarmer(farmer);
        entry.setLoanProductId(String.valueOf(request.loanProductId()));
        entry.setLoanName(request.loanName());
        entry.setJoinedAt(LocalDateTime.now());

        waitlistRepository.save(entry);
    }
}