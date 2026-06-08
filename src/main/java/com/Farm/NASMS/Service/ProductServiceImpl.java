package com.Farm.NASMS.Service;

import com.Farm.NASMS.Farmer;
import com.Farm.NASMS.Product;
import com.Farm.NASMS.ProductRequest;
import com.Farm.NASMS.Repository.FarmerRepository;
import com.Farm.NASMS.Repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    private FarmerRepository farmerRepository;
    public ProductServiceImpl(ProductRepository productRepository,FarmerRepository farmerRepository){
        this.productRepository = productRepository;
        this.farmerRepository = farmerRepository;
    }
    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public Product addProduct(ProductRequest request) {
        Farmer farmer = farmerRepository.findById(request.getFarmerId())
                .orElseThrow(()-> new RuntimeException("Farmer not found!"));
        Product product = new Product();
        product.setName(request.getName());
        product.setQuantityUnit(request.getQuantityUnit());
        product.setUnitPrice_ksh(request.getUnit_Price_ksh());
        product.setFarmer(farmer);
        return productRepository.save(product);
    }

    @Override
    public Product updateProductById(Long id,ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Product not found"));
        /*existingProduct.setAgroforestryProduct(product.getAgroforestryProduct());
        existingProduct.setAquacultureProduct(product.getAquacultureProduct());
        existingProduct.setCropProduct(product.getCropProduct());
        existingProduct.setFarmingType(product.getFarmingType());
        existingProduct.setHorticulturalProduct(product.getHorticulturalProduct());
        existingProduct.setLivestockProduct(product.getLivestockProduct());
        existingProduct.setPoultryProduct(product.getPoultryProduct());
        existingProduct.setProductStatus(product.getProductStatus());*/
        BeanUtils.copyProperties(request, existingProduct, "id", "farmer", "createdAt", "updatedAt");

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
       if(!productRepository.existsById(id)){
           throw new RuntimeException("Product not found");
       }
       productRepository.deleteById(id);
    }
}
