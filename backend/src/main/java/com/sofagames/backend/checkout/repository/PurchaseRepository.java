package com.sofagames.backend.checkout.repository;

import com.sofagames.backend.checkout.entity.Purchase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @EntityGraph(attributePaths = {"game"})
    List<Purchase> findByUserId(UUID userId);

    boolean existsByUserIdAndGameId(UUID userId, Long gameId);
}