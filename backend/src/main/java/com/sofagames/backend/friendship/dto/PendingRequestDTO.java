package com.sofagames.backend.friendship.dto;

import java.util.UUID;

/**
 * DTO de respuesta para solicitudes de amistad pendientes recibidas.
 * Incluye el ID de la amistad (para aceptar/ignorar) y los datos del solicitante.
 */
public record PendingRequestDTO(
        Long   friendshipId,
        UUID   requesterId,
        String username,
        String displayName,
        String avatarUrl
) {}