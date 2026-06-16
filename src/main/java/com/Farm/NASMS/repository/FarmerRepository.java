package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.Farm.NASMS.model.Farmer;

import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer,Long> {
    Optional<Farmer> findByNationalId(Long nationalId);
    Optional<Farmer>findById(Long id);
    @Query("SELECT COUNT(f) FROM Farmer f")
    long countFarmers();

}
