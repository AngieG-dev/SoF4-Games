package com.sofagames.backend.checkout.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record CheckoutResponseDTO(
        String orderId,
        List<PurchasedGameDTO> games,
        Integer total,
        String currency,
        OffsetDateTime purchasedAt) {
    public record PurchasedGameDTO(
            Long gameId,
            String name,
            String headerImage,
            Integer pricePaid) {
    }
}