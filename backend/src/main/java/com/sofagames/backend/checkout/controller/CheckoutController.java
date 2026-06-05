package com.sofagames.backend.checkout.controller;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.checkout.dto.CheckoutResponseDTO;
import com.sofagames.backend.checkout.service.CheckoutService;
import com.sofagames.backend.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CheckoutResponseDTO> checkout(
            @RequestHeader("Authorization") String authHeader) {

        UUID userId = extractUserId(authHeader);
        CheckoutResponseDTO response = checkoutService.checkout(userId);
        return ResponseEntity.ok(response);
    }

    private UUID extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}