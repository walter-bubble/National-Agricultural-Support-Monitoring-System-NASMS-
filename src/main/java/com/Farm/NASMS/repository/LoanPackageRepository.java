package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Farm.NASMS.model.LoanPackage;

public interface LoanPackageRepository extends JpaRepository<LoanPackage, String> {
}
