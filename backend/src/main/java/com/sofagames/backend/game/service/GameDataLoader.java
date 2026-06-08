package com.sofagames.backend.game.service;

import com.sofagames.backend.game.entity.*;
import com.sofagames.backend.game.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Component
public class GameDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadyRan = false;

    private final GameRepository       gameRepository;
    private final GenreRepository      genreRepository;
    private final CategoryRepository   categoryRepository;
    private final DeveloperRepository  developerRepository;
    private final PublisherRepository  publisherRepository;
    private final ScreenshotRepository screenshotRepository;
    private final ObjectMapper         objectMapper;

    public GameDataLoader(GameRepository gameRepository,
                          GenreRepository genreRepository,
                          CategoryRepository categoryRepository,
                          DeveloperRepository developerRepository,
                          PublisherRepository publisherRepository,
                          ScreenshotRepository screenshotRepository,
                          ObjectMapper objectMapper) {
        this.gameRepository       = gameRepository;
        this.genreRepository      = genreRepository;
        this.categoryRepository   = categoryRepository;
        this.developerRepository  = developerRepository;
        this.publisherRepository  = publisherRepository;
        this.screenshotRepository = screenshotRepository;
        this.objectMapper         = objectMapper;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadyRan) return;  // ← línea nueva
        alreadyRan = true;

        if (gameRepository.count() > 0) {
            System.out.println("Database already contains games. Skipping data load.");
            return;
        }

        System.out.println("Loading game data from catalog_final.json...");
        try {
            ClassPathResource resource = new ClassPathResource("catalog_final.json");

            Object parsed = objectMapper.readValue(resource.getInputStream(), Object.class);

            List<Map<String, Object>> gameList = new ArrayList<>();

            if (parsed instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> list = (List<Map<String, Object>>) parsed;
                gameList = list;
            } else if (parsed instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> map = (Map<String, Object>) parsed;
                for (Object val : map.values()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> gameData = (Map<String, Object>) val;
                    gameList.add(gameData);
                }
            }

            for (Map<String, Object> gameData : gameList) {
                try {
                    Game game = mapToGame(gameData);
                    Game savedGame = gameRepository.saveAndFlush(game);

                    if (gameData.containsKey("genres")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> genres = (List<Map<String, Object>>) gameData.get("genres");
                        for (Map<String, Object> genreData : genres) {
                            Integer gid  = parseIntSafe(genreData.get("id"));
                            String gname = genreData.get("name") != null
                                    ? (String) genreData.get("name")
                                    : (String) genreData.get("description");
                            Genre genre = genreRepository.findById(gid)
                                    .orElseGet(() -> {
                                        Genre g = new Genre();
                                        g.setId(gid);
                                        g.setName(gname != null ? gname : "Unknown");
                                        return genreRepository.save(g);
                                    });
                            savedGame.getGenres().add(genre);
                        }
                    }

                    if (gameData.containsKey("categories")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> categories = (List<Map<String, Object>>) gameData.get("categories");
                        for (Map<String, Object> catData : categories) {
                            Integer cid  = parseIntSafe(catData.get("id"));
                            String cname = catData.get("name") != null
                                    ? (String) catData.get("name")
                                    : (String) catData.get("description");
                            Category category = categoryRepository.findById(cid)
                                    .orElseGet(() -> {
                                        Category c = new Category();
                                        c.setId(cid);
                                        c.setName(cname != null ? cname : "Unknown");
                                        return categoryRepository.save(c);
                                    });
                            savedGame.getCategories().add(category);
                        }
                    }

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

                    if (gameData.containsKey("screenshots")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> screenshots = (List<Map<String, Object>>) gameData.get("screenshots");
                        for (Map<String, Object> shotData : screenshots) {
                            Screenshot screenshot = new Screenshot();
                            screenshot.setGameId(savedGame.getId());
                            Object idObj = shotData.get("steam_id") != null
                                    ? shotData.get("steam_id")
                                    : shotData.get("id");
                            screenshot.setSteamId(idObj instanceof Number ? ((Number) idObj).intValue() : 0);
                            screenshot.setPathThumbnail((String) shotData.get("path_thumbnail"));
                            screenshot.setPathFull((String) shotData.get("path_full"));
                            Integer order = shotData.get("display_order") instanceof Number
                                    ? ((Number) shotData.get("display_order")).intValue()
                                    : screenshot.getSteamId();
                            screenshot.setDisplayOrder(order);
                            screenshotRepository.save(screenshot);
                        }
                    }

                    gameRepository.save(savedGame);

                } catch (Exception e) {
                    System.err.println("Error processing game: " + gameData.get("name") + " — " + e.getMessage());
                    e.printStackTrace();
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

        game.setSteamAppId(parseIntSafe(data.get("steam_appid")));

        game.setCollection((String) data.get("collection"));
        game.setName((String) data.get("name"));
        game.setShortDescription((String) data.get("short_description"));
        game.setDetailedDescription((String) data.get("detailed_description"));
        game.setHeaderImage((String) data.get("header_image"));
        game.setCapsuleImage((String) data.get("capsule_image"));
        game.setBackgroundRaw((String) data.get("background_raw"));
        game.setWebsite((String) data.get("website"));
        game.setIsFree((Boolean) data.getOrDefault("is_free", false));

        if (data.containsKey("price_initial")) {
            game.setPriceInitial(parseIntSafe(data.get("price_initial")));
            game.setPriceFinal(parseIntSafe(data.get("price_final")));
            game.setDiscountPercent(parseIntSafe(data.get("discount_percent")));
            game.setCurrency((String) data.getOrDefault("currency", "CLP"));
            game.setPriceInitialFormatted((String) data.get("price_initial_formatted"));
            game.setPriceFinalFormatted((String) data.get("price_final_formatted"));
        } else if (data.containsKey("price_overview") && data.get("price_overview") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> po = (Map<String, Object>) data.get("price_overview");
            game.setPriceInitial(parseIntSafe(po.get("initial")));
            game.setPriceFinal(parseIntSafe(po.get("final")));
            game.setDiscountPercent(parseIntSafe(po.get("discount_percent")));
            game.setCurrency((String) po.getOrDefault("currency", "CLP"));
        } else {
            game.setPriceInitial(0);
            game.setPriceFinal(0);
            game.setDiscountPercent(0);
            game.setCurrency("CLP");
        }

        if (data.containsKey("release_date")) {
            Object rdObj = data.get("release_date");
            if (rdObj instanceof String) {
                game.setReleaseDate(parseDate((String) rdObj));
            } else if (rdObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> rd = (Map<String, Object>) rdObj;
                game.setComingSoon((Boolean) rd.getOrDefault("coming_soon", false));
                game.setReleaseDate(parseDateLegacy((String) rd.get("date")));
            }
        }

        if (data.containsKey("coming_soon")) {
            game.setComingSoon((Boolean) data.getOrDefault("coming_soon", false));
        }

        game.setRequiredAge(((Number) data.getOrDefault("required_age", 0)).intValue());
        game.setControllerSupport((String) data.get("controller_support"));
        game.setSupportedLanguages((String) data.get("supported_languages"));

        if (data.containsKey("recommendations_total")) {
            game.setRecommendationsTotal(parseIntSafe(data.get("recommendations_total")));
        } else if (data.containsKey("recommendations") && data.get("recommendations") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> rec = (Map<String, Object>) data.get("recommendations");
            game.setRecommendationsTotal(parseIntSafe(rec.get("total")));
        }

        if (data.containsKey("achievements_total")) {
            game.setAchievementsTotal(parseIntSafe(data.get("achievements_total")));
        } else if (data.containsKey("achievements") && data.get("achievements") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> ach = (Map<String, Object>) data.get("achievements");
            game.setAchievementsTotal(parseIntSafe(ach.get("total")));
        }

        if (data.containsKey("platform_windows")) {
            game.setPlatformWindows((Boolean) data.getOrDefault("platform_windows", false));
            game.setPlatformMac((Boolean) data.getOrDefault("platform_mac", false));
            game.setPlatformLinux((Boolean) data.getOrDefault("platform_linux", false));
        } else if (data.containsKey("platforms") && data.get("platforms") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> platforms = (Map<String, Object>) data.get("platforms");
            game.setPlatformWindows((Boolean) platforms.getOrDefault("windows", false));
            game.setPlatformMac((Boolean) platforms.getOrDefault("mac", false));
            game.setPlatformLinux((Boolean) platforms.getOrDefault("linux", false));
        }

        game.setReviewScoreDesc((String) data.get("review_score_desc"));
        game.setTotalPositive(parseIntSafe(data.get("total_positive")));
        game.setTotalNegative(parseIntSafe(data.get("total_negative")));

        if (data.containsKey("metacritic_score")) {
            game.setMetacriticScore(data.get("metacritic_score") != null
                    ? parseIntSafe(data.get("metacritic_score")) : null);
            game.setMetacriticUrl((String) data.get("metacritic_url"));
        } else if (data.containsKey("metacritic") && data.get("metacritic") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> mc = (Map<String, Object>) data.get("metacritic");
            game.setMetacriticScore(parseIntSafe(mc.get("score")));
            game.setMetacriticUrl((String) mc.get("url"));
        }

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

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private LocalDate parseDateLegacy(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private int parseIntSafe(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Integer) return (Integer) obj;
        if (obj instanceof Long)    return ((Long) obj).intValue();
        if (obj instanceof String)  {
            try { return Integer.parseInt((String) obj); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }
}