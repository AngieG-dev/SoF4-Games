package com.sofagames.backend.game.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "developers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Developer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "developers")
    @Builder.Default
    private Set<Game> games = new HashSet<>();
}
