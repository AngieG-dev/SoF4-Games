package com.sofagames.backend.friendship.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record FriendRequestDTO(
        @NotNull(message = "addresseeId es requerido")
        UUID addresseeId
) {}