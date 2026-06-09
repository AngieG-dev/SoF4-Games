package com.sofagames.backend.cart.controller;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.cart.dto.CartItemDTO;
import com.sofagames.backend.cart.service.CartService;
import com.sofagames.backend.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/{gameId}")
    public ResponseEntity<CartItemDTO> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gameId) {

        UUID userId = extractUserId(authHeader);
        return ResponseEntity.ok(cartService.addToCart(userId, gameId));
    }

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(
            @RequestHeader("Authorization") String authHeader) {

        UUID userId = extractUserId(authHeader);
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gameId) {

        UUID userId = extractUserId(authHeader);
        cartService.removeFromCart(userId, gameId);
        return ResponseEntity.noContent().build();
    }

    private UUID extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}