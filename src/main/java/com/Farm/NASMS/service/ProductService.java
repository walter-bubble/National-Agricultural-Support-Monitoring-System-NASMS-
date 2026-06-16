package com.Farm.NASMS.service;

import java.util.List;

import com.Farm.NASMS.dto.ProductRequest;
import com.Farm.NASMS.model.Product;

public interface ProductService {
List<Product> getAllProduct();
Product addProduct(ProductRequest request);
Product updateProductById(Long id, ProductRequest request);
void deleteProduct(Long id);
}
