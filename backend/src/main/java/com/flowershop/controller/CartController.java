package com.flowershop.controller;

import com.flowershop.model.CartItem;
import com.flowershop.model.Product;
import com.flowershop.repository.CartItemRepository;
import com.flowershop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(originPatterns = "*")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<CartItem> getCartItems(@RequestParam(defaultValue = "user@example.com") String email) {
        return cartItemRepository.findByUserEmail(email);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestParam Long productId,
                                              @RequestParam(defaultValue = "1") Integer quantity,
                                              @RequestParam(defaultValue = "user@example.com") String email) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();
        Optional<CartItem> existingCartItem = cartItemRepository.findByUserEmailAndProductId(email, productId);

        CartItem item;
        if (existingCartItem.isPresent()) {
            item = existingCartItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem(email, product, quantity);
        }

        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        if (cartItemRepository.existsById(id)) {
            cartItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Transactional
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam(defaultValue = "user@example.com") String email) {
        cartItemRepository.deleteByUserEmail(email);
        return ResponseEntity.ok().build();
    }
}
