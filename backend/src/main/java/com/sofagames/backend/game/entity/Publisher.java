package com.sofagames.backend.game.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "publishers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Publisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "publishers")
    @Builder.Default
    private Set<Game> games = new HashSet<>();
}
