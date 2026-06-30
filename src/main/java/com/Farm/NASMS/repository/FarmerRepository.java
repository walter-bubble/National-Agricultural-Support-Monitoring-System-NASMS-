package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.lang.NonNull;
import com.Farm.NASMS.model.Farmer;
import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    Optional<Farmer> findByNationalId(Long nationalId);

    // FIXED: added @NonNull to match J paRepository's @NonNullApi contract
    @Override
    @NonNull
    Optional<Farmer> findById(@NonNull Long id);

    Optional<Farmer> findByEmail(String email);


    // REMOVED countFarmers() if it is unused — add back when needed
}