package com.sofagames.backend.auth.dto;

import java.util.UUID;

/**
 * DTO de respuesta para resultados de búsqueda de usuarios.
 * Solo expone datos públicos — nunca el email ni el password.
 */
public record UserSearchDTO(
        UUID   userId,
        String username,
        String displayName,
        String avatarUrl
) {}
