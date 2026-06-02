package com.sofagames.backend.friendship.dto;

import java.util.UUID;

/**
 * Datos del amigo que se devuelven al frontend.
 * Se construye a partir del UserProfile del otro usuario en la amistad.
 */
public record FriendDTO(
        UUID   userId,
        String displayName,
        String username,
        String avatarUrl
) {}