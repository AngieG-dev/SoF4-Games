package com.sofagames.backend.cart.dto;

import java.time.OffsetDateTime;

public record CartItemDTO(
        Long gameId,
        Integer steamAppId,
        String name,
        String headerImage,
        Integer priceFinal,
        String currency,
        OffsetDateTime addedAt) {
}