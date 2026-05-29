package com.sofagames.backend.game.service;

import com.sofagames.backend.game.entity.*;
import com.sofagames.backend.game.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GameDataLoader implements ApplicationListener<ApplicationReadyEvent> {

    private final GameRepository gameRepository;
    private final GenreRepository genreRepository;
    private final CategoryRepository categoryRepository;
    private final DeveloperRepository developerRepository;
    private final PublisherRepository publisherRepository;
    private final ScreenshotRepository screenshotRepository;
    private final ObjectMapper objectMapper;

    public GameDataLoader(GameRepository gameRepository,
                          GenreRepository genreRepository,
                          CategoryRepository categoryRepository,
                          DeveloperRepository developerRepository,
                          PublisherRepository publisherRepository,
                          ScreenshotRepository screenshotRepository,
                          ObjectMapper objectMapper) {
        this.gameRepository = gameRepository;
        this.genreRepository = genreRepository;
        this.categoryRepository = categoryRepository;
        this.developerRepository = developerRepository;
        this.publisherRepository = publisherRepository;
        this.screenshotRepository = screenshotRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (gameRepository.count() > 0) {
            System.out.println("Database already contains games. Skipping data load.");
            return;
        }

        System.out.println("Loading game data from catalog_final.json...");
        try {
            ClassPathResource resource = new ClassPathResource("catalog_final.json");
            Map<String, Object> catalog = objectMapper.readValue(resource.getInputStream(), Map.class);

            for (Map.Entry<String, Object> entry : catalog.entrySet()) {
                String gameId = entry.getKey();
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> gameData = (Map<String, Object>) entry.getValue();

                    Game game = mapToGame(gameData);
                    Game savedGame = gameRepository.save(game);

                    // Process genres
                    if (gameData.containsKey("genres")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> genres = (List<Map<String, Object>>) gameData.get("genres");
                        for (Map<String, Object> genreData : genres) {
                            Integer id = parseIntSafe(genreData.get("id"));
                            String name = (String) genreData.get("description") != null ? (String) genreData.get("description") : (String) genreData.get("name");
                            Genre genre = genreRepository.findById(id)
                                    .orElseGet(() -> {
                                        Genre g = new Genre();
                                        g.setId(id);
                                        g.setName(name != null ? name : "Unknown");
                                        return genreRepository.save(g);
                                    });
                            savedGame.getGenres().add(genre);
                        }
                    }

                    // Process categories
                    if (gameData.containsKey("categories")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> categories = (List<Map<String, Object>>) gameData.get("categories");
                        for (Map<String, Object> catData : categories) {
                            Integer id = parseIntSafe(catData.get("id"));
                            String name = (String) catData.get("description") != null ? (String) catData.get("description") : (String) catData.get("name");
                            Category category = categoryRepository.findById(id)
                                    .orElseGet(() -> {
                                        Category c = new Category();
                                        c.setId(id);
                                        c.setName(name != null ? name : "Unknown");
                                        return categoryRepository.save(c);
                                    });
                                    savedGame.getCategories().add(category);
                        }
                    }

                    // Process developers
                    if (gameData.containsKey("developers")) {
                        @SuppressWarnings("unchecked")
                        List<String> developers = (List<String>) gameData.get("developers");
                        for (String devName : developers) {
                            if (devName == null || devName.isBlank()) continue;
                            Developer developer = developerRepository.findByName(devName)
                                    .orElseGet(() -> {
                                        Developer d = new Developer();
                                        d.setName(devName);
                                        return developerRepository.save(d);
                                    });
                            savedGame.getDevelopers().add(developer);
                        }
                    }

                    // Process publishers
                    if (gameData.containsKey("publishers")) {
                        @SuppressWarnings("unchecked")
                        List<String> publishers = (List<String>) gameData.get("publishers");
                        for (String pubName : publishers) {
                            if (pubName == null || pubName.isBlank()) continue;
                            Publisher publisher = publisherRepository.findByName(pubName)
                                    .orElseGet(() -> {
                                        Publisher p = new Publisher();
                                        p.setName(pubName);
                                        return publisherRepository.save(p);
                                    });
                            savedGame.getPublishers().add(publisher);
                        }
                    }

                    // Process screenshots
                    if (gameData.containsKey("screenshots")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> screenshots = (List<Map<String, Object>>) gameData.get("screenshots");
                        for (Map<String, Object> shotData : screenshots) {
                            Screenshot screenshot = new Screenshot();
                            screenshot.setGame(savedGame);
                            Object idObj = shotData.get("id");
                            screenshot.setSteamId(idObj instanceof Number ? ((Number) idObj).intValue() : 0);
                            screenshot.setPathThumbnail((String) shotData.get("path_thumbnail"));
                            screenshot.setPathFull((String) shotData.get("path_full"));
                            Integer order = (Integer) shotData.get("display_order");
                            if (order == null) {
                                order = screenshot.getSteamId();
                            }
                            screenshot.setDisplayOrder(order);
                            screenshotRepository.save(screenshot);
                        }
                    }

                    gameRepository.save(savedGame);
                } catch (Exception e) {
                    System.err.println("Error processing game with ID: " + gameId + ". Error: " + e.getMessage());
                    e.printStackTrace();
                    throw e; // Relanzar para detener y ver el error
                }
            }

            System.out.println("Finished loading game data. Total games: " + gameRepository.count());
        } catch (Exception e) {
            System.err.println("Error loading game data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Game mapToGame(Map<String, Object> data) {
        Game game = new Game();

        Object steamAppIdObj = data.get("steam_appid");
        int steamAppId;
        if (steamAppIdObj instanceof Integer) {
            steamAppId = (Integer) steamAppIdObj;
        } else if (steamAppIdObj instanceof Long) {
            steamAppId = ((Long) steamAppIdObj).intValue();
        } else if (steamAppIdObj instanceof String) {
            steamAppId = Integer.parseInt((String) steamAppIdObj);
        } else {
            steamAppId = 0;
        }
        game.setSteamAppId(steamAppId);
        game.setName((String) data.get("name"));
        game.setShortDescription((String) data.get("short_description"));
        game.setHeaderImage((String) data.get("header_image"));
        game.setCapsuleImage((String) data.get("capsule_image"));
        game.setBackgroundRaw((String) data.get("background_raw"));
        game.setWebsite((String) data.get("website"));
        game.setIsFree((Boolean) data.getOrDefault("is_free", false));

        // price_overview
        if (data.containsKey("price_overview") && data.get("price_overview") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> priceOverview = (Map<String, Object>) data.get("price_overview");
            game.setCurrency((String) priceOverview.get("currency"));
            game.setPriceInitial(parseIntSafe(priceOverview.get("initial")));
            game.setPriceFinal(parseIntSafe(priceOverview.get("final")));
            game.setDiscountPercent(parseIntSafe(priceOverview.get("discount_percent")));
        } else {
            game.setCurrency("CLP");
            game.setPriceInitial(0);
            game.setPriceFinal(0);
            game.setDiscountPercent(0);
        }

        // release_date
        if (data.containsKey("release_date") && data.get("release_date") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> releaseDate = (Map<String, Object>) data.get("release_date");
            boolean comingSoon = (Boolean) releaseDate.getOrDefault("coming_soon", false);
            game.setComingSoon(comingSoon);
            String dateStr = (String) releaseDate.get("date");
            if (dateStr != null && !dateStr.isEmpty()) {
                try {
                    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);
                    game.setReleaseDate(java.time.LocalDate.parse(dateStr, formatter));
                } catch (Exception e) {
                    // leave null if parsing fails
                }
            }
        }

        game.setRequiredAge(((Number) data.getOrDefault("required_age", 0)).intValue());
        game.setControllerSupport((String) data.get("controller_support"));
        game.setSupportedLanguages((String) data.get("supported_languages"));
        game.setRecommendationsTotal(((Number) data.getOrDefault("recommendations_total", 0)).intValue());
        game.setAchievementsTotal(((Number) data.getOrDefault("achievements_total", 0)).intValue());

        if (data.containsKey("system_requirements") && data.get("system_requirements") != null) {
            try {
                game.setSystemRequirements(objectMapper.writeValueAsString(data.get("system_requirements")));
            } catch (Exception e) {
                game.setSystemRequirements("{}");
            }
        } else {
            game.setSystemRequirements("{}");
        }

        return game;
    }

    private int parseIntSafe(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Integer) return (Integer) obj;
        if (obj instanceof Long) return ((Long) obj).intValue();
        if (obj instanceof String) {
            try { return Integer.parseInt((String) obj); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }
}
