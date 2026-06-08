package com.sofagames.backend.game.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "games")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "steam_appid", nullable = false, unique = true)
    private Integer steamAppId;

    @Column(name = "collection")
    private String collection;

    @Column(nullable = false)
    private String name;

    private String collection;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "detailed_description", columnDefinition = "TEXT")
    private String detailedDescription;

    @Column(name = "header_image", columnDefinition = "TEXT")
    private String headerImage;

    @Column(name = "capsule_image", columnDefinition = "TEXT")
    private String capsuleImage;

    @Column(name = "background_raw", columnDefinition = "TEXT")
    private String backgroundRaw;

    private String website;

    @Column(name = "is_free", nullable = false)
    @Builder.Default
    private Boolean isFree = false;

    @Column(name = "price_initial", nullable = false)
    @Builder.Default
    private Integer priceInitial = 0;

    @Column(name = "price_final", nullable = false)
    @Builder.Default
    private Integer priceFinal = 0;

    @Column(name = "discount_percent", nullable = false)
    @Builder.Default
    private Integer discountPercent = 0;

    private String currency;

    @Column(name = "price_initial_formatted")
    private String priceInitialFormatted;

    @Column(name = "price_final_formatted")
    private String priceFinalFormatted;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "coming_soon", nullable = false)
    @Builder.Default
    private Boolean comingSoon = false;

    @Column(name = "required_age", nullable = false)
    @Builder.Default
    private Integer requiredAge = 0;

    @Column(name = "controller_support")
    private String controllerSupport;

    @Column(name = "supported_languages", columnDefinition = "TEXT")
    private String supportedLanguages;

    @Column(name = "platform_windows", nullable = false)
    @Builder.Default
    private Boolean platformWindows = true;

    @Column(name = "platform_mac", nullable = false)
    @Builder.Default
    private Boolean platformMac = false;

    @Column(name = "platform_linux", nullable = false)
    @Builder.Default
    private Boolean platformLinux = false;

    @Column(name = "review_score_desc")
    private String reviewScoreDesc;

    @Column(name = "total_positive", nullable = false)
    @Builder.Default
    private Integer totalPositive = 0;

    @Column(name = "total_negative", nullable = false)
    @Builder.Default
    private Integer totalNegative = 0;

    @Column(name = "recommendations_total", nullable = false)
    @Builder.Default
    private Integer recommendationsTotal = 0;

    @Column(name = "metacritic_score")
    private Integer metacriticScore;

    @Column(name = "metacritic_url")
    private String metacriticUrl;

    @Column(name = "achievements_total", nullable = false)
    @Builder.Default
    private Integer achievementsTotal = 0;

    @Column(name = "system_requirements", columnDefinition = "TEXT")
    private String systemRequirements;

    // ── Plataformas ──
    @Column(name = "platform_windows", nullable = false)
    @Builder.Default
    private Boolean platformWindows = false;

    @Column(name = "platform_mac", nullable = false)
    @Builder.Default
    private Boolean platformMac = false;

    @Column(name = "platform_linux", nullable = false)
    @Builder.Default
    private Boolean platformLinux = false;

    // ── Reseñas ──
    @Column(name = "review_score_desc")
    private String reviewScoreDesc;

    @Column(name = "total_positive", nullable = false)
    @Builder.Default
    private Integer totalPositive = 0;

    @Column(name = "total_negative", nullable = false)
    @Builder.Default
    private Integer totalNegative = 0;

    // ── Metacritic ──
    @Column(name = "metacritic_score")
    private Integer metacriticScore;

    @Column(name = "metacritic_url", columnDefinition = "TEXT")
    private String metacriticUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    // ==================== RELACIONES ====================

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "game_genres",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    @Builder.Default
    private Set<Genre> genres = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "game_tags",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "game_categories",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "game_developers",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "developer_id"))
    @Builder.Default
    private Set<Developer> developers = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "game_publishers",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "publisher_id"))
    @Builder.Default
    private Set<Publisher> publishers = new HashSet<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private Set<Screenshot> screenshots = new HashSet<>();
}