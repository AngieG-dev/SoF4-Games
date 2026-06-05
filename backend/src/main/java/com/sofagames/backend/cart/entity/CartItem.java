package com.sofagames.backend.cart.entity;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.game.entity.Game;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "added_at", nullable = false)
    private OffsetDateTime addedAt;

    @PrePersist
    void prePersist() {
        addedAt = OffsetDateTime.now();
    }
}