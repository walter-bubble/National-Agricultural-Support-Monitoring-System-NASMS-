package com.Farm.NASMS.Controller;

import com.Farm.NASMS.Product;
import com.Farm.NASMS.ProductRequest;
import com.Farm.NASMS.Service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    private ProductService productService;
    public ProductController(ProductService productService){
        this.productService=productService;
    }
    @GetMapping("/")
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }
    @PostMapping()
    public Product addProduct(@RequestBody ProductRequest request){
        return productService.addProduct(request);
    }
    @PutMapping("/{id}")
    public Product updateProductById(@PathVariable Long id, @RequestBody ProductRequest request){
        return productService.updateProductById(id,request);
    }
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
        return "Product deleted Successfully";
    }
}
