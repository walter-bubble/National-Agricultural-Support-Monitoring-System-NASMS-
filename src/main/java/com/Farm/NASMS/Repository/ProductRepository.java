package com.Farm.NASMS.Repository;

import com.Farm.NASMS.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
