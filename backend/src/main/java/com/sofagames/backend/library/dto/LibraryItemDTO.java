package com.sofagames.backend.library.dto;
import java.time.OffsetDateTime;

public record LibraryItemDTO(
        Long id,
        Integer steamAppId,
        String name,
        String headerImage,
        OffsetDateTime purchasedAt
){}