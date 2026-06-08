package com.Farm.NASMS.Service;

import com.Farm.NASMS.Product;
import com.Farm.NASMS.ProductRequest;

import java.util.List;

public interface ProductService {
List<Product> getAllProduct();
Product addProduct(ProductRequest request);
Product updateProductById(Long id, ProductRequest request);
void deleteProduct(Long id);
}
