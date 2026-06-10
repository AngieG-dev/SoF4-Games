package com.sofagames.backend.friendship.repository;

import com.sofagames.backend.friendship.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // ¿Ya existe una solicitud de A hacia B?
    boolean existsByRequesterIdAndAddresseeId(UUID requesterId, UUID addresseeId);

    // Solicitud específica de A hacia B (para cancelar)
    Optional<Friendship> findByRequesterIdAndAddresseeId(UUID requesterId, UUID addresseeId);

    // Amistades aceptadas del usuario (en ambas direcciones)
    @Query("""
            SELECT f FROM Friendship f
            WHERE (f.requester.id = :userId OR f.addressee.id = :userId)
              AND f.status = :status
            """)
    List<Friendship> findAcceptedFriendships(@Param("userId") UUID userId,
                                             @Param("status") String status);

    // Solicitudes PENDIENTES recibidas por el usuario (él es el addressee)
    @Query("""
            SELECT f FROM Friendship f
            WHERE f.addressee.id = :userId
              AND f.status = 'PENDING'
            ORDER BY f.createdAt DESC
            """)
    List<Friendship> findPendingRequestsReceived(@Param("userId") UUID userId);

    // Solicitudes PENDIENTES enviadas por el usuario (él es el requester)
    @Query("""
            SELECT f FROM Friendship f
            WHERE f.requester.id = :userId
              AND f.status = 'PENDING'
            """)
    List<Friendship> findPendingRequestsSent(@Param("userId") UUID userId);
}