package com.sofagames.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(name = "display_name")
    private String displayName;

    @Column(unique = true)
    private String username;

    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    private String location;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private java.time.ZonedDateTime updatedAt;
}
