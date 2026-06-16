package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Farm.NASMS.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
