package com.sofagames.backend.friendship.dto;

import java.util.UUID;

/**
 * DTO de respuesta para cada amigo en la lista.
 * Incluye friendshipId para poder eliminar la amistad desde el frontend.
 */
public record FriendDTO(
        Long   friendshipId,
        UUID   userId,
        String displayName,
        String username,
        String avatarUrl
) {}