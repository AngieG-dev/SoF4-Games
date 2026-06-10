package com.sofagames.backend.friendship.dto;

import java.util.UUID;

/**
 * DTO de respuesta para solicitudes de amistad enviadas pendientes.
 * Incluye el ID de la amistad (para cancelarla) y los datos del destinatario.
 */
public record SentRequestDTO(
        Long   friendshipId,
        UUID   addresseeId,
        String username,
        String displayName,
        String avatarUrl
) {}