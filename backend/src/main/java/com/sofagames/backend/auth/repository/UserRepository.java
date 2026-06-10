package com.sofagames.backend.auth.repository;

import com.sofagames.backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByUserProfileUsername(String username);

    /**
     * Busca usuarios cuyo username o displayName contenga el texto dado (case-insensitive).
     * Solo devuelve usuarios con perfil configurado (que tienen username).
     * El límite de 10 se aplica en el controller.
     */
    @Query("""
            SELECT u FROM User u
            JOIN u.userProfile p
            WHERE LOWER(p.username) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.displayName) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY p.username ASC
            """)
    List<User> searchByUsername(@Param("query") String query);
}