package com.sofagames.backend.game.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "genres")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Genre {

    @Id
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "genres")
    @Builder.Default
    private Set<Game> games = new HashSet<>();
}
