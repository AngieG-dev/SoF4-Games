package com.sofagames.backend.checkout.entity;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.game.entity.Game;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "price_paid", nullable = false)
    private Integer pricePaid;

    @Column(name = "purchased_at", nullable = false)
    private OffsetDateTime purchasedAt;

    @PrePersist
    void prePersist() {
        purchasedAt = OffsetDateTime.now();
    }
}