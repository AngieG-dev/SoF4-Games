package com.sofagames.backend.cart.repository;

import com.sofagames.backend.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(UUID userId);

    boolean existsByUserIdAndGameId(UUID userId, Long gameId);

    void deleteByUserIdAndGameId(UUID userId, Long gameId);
}