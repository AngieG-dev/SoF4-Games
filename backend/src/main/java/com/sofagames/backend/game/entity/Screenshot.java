package com.sofagames.backend.game.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "screenshots")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Screenshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "steam_id", nullable = false)
    private Integer steamId;

    @Column(name = "path_thumbnail", nullable = false, columnDefinition = "TEXT")
    private String pathThumbnail;

    @Column(name = "path_full", nullable = false, columnDefinition = "TEXT")
    private String pathFull;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", insertable = false, updatable = false)
    @JsonIgnore
    private Game game;
}
