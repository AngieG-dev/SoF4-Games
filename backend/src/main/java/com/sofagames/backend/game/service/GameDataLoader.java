package com.sofagames.backend.game.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofagames.backend.game.entity.*;
import com.sofagames.backend.game.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class GameDataLoader implements CommandLineRunner {

    private final GameRepository gameRepository;
    private final GenreRepository genreRepository;
    private final CategoryRepository categoryRepository;
    private final DeveloperRepository developerRepository;
    private final PublisherRepository publisherRepository;
    private final TagRepository tagRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (gameRepository.count() > 0) {
            log.info("Base de datos de juegos ya poblada. Saltando carga.");
            return;
        }

        log.info("Iniciando carga de juegos desde JSON...");
        try {
            InputStream inputStream = new ClassPathResource("catalog_final.json").getInputStream();
            List<Map<String, Object>> gamesData = objectMapper.readValue(inputStream, new TypeReference<>() {});

            for (Map<String, Object> data : gamesData) {
                try {
                    loadGame(data);
                } catch (Exception e) {
                    log.error("Error cargando juego {}: {}", data.get("name"), e.getMessage());
                }
            }
            log.info("Carga de datos finalizada. {} juegos cargados.", gameRepository.count());
        } catch (Exception e) {
            log.error("Error crítico al cargar el catálogo: {}", e.getMessage());
        }
    }

    private void loadGame(Map<String, Object> data) {
        Game game = Game.builder()
                .steamAppId((Integer) data.get("steam_appid"))
                .name((String) data.get("name"))
                .collection((String) data.get("collection"))
                .shortDescription((String) data.get("short_description"))
                .detailedDescription((String) data.get("detailed_description"))
                .website((String) data.get("website"))
                .headerImage((String) data.get("header_image"))
                .capsuleImage((String) data.get("capsule_image"))
                .backgroundRaw((String) data.get("background_raw"))
                .isFree((Boolean) data.get("is_free"))
                .priceInitial(parseIntSafe(data.get("price_initial")))
                .priceFinal(parseIntSafe(data.get("price_final")))
                .discountPercent(parseIntSafe(data.get("discount_percent")))
                .currency((String) data.get("currency"))
                .priceInitialFormatted((String) data.get("price_initial_formatted"))
                .priceFinalFormatted((String) data.get("price_final_formatted"))
                .comingSoon((Boolean) data.get("coming_soon"))
                .requiredAge(parseIntSafe(data.get("required_age")))
                .controllerSupport((String) data.get("controller_support"))
                .supportedLanguages((String) data.get("supported_languages"))
                .platformWindows((Boolean) data.get("platform_windows"))
                .platformMac((Boolean) data.get("platform_mac"))
                .platformLinux((Boolean) data.get("platform_linux"))
                .reviewScoreDesc((String) data.get("review_score_desc"))
                .totalPositive(parseIntSafe(data.get("total_positive")))
                .totalNegative(parseIntSafe(data.get("total_negative")))
                .recommendationsTotal(parseIntSafe(data.get("recommendations_total")))
                .metacriticScore(parseIntSafe(data.get("metacritic_score")))
                .metacriticUrl((String) data.get("metacritic_url"))
                .achievementsTotal(parseIntSafe(data.get("achievements_total")))
                .systemRequirements(objectMapper.valueToTree(data.get("system_requirements")).toString())
                .build();

        // Parse release date
        String releaseDateStr = (String) data.get("release_date");
        if (releaseDateStr != null && !releaseDateStr.isBlank()) {
            try {
                game.setReleaseDate(LocalDate.parse(releaseDateStr));
            } catch (Exception e) {
                log.warn("Formato de fecha inválido para {}: {}", game.getName(), releaseDateStr);
            }
        }

        Game savedGame = gameRepository.save(game);

        processGenres(data, savedGame);
        processCategories(data, savedGame);
        processDevelopers(data, savedGame);
        processPublishers(data, savedGame);
        processTags(data, savedGame);
        processScreenshots(data, savedGame);

        gameRepository.save(savedGame);
    }

    private void processGenres(Map<String, Object> data, Game game) {
        List<Map<String, Object>> genresData = (List<Map<String, Object>>) data.get("genres");
        if (genresData != null) {
            for (Map<String, Object> gData : genresData) {
                Integer id = (Integer) gData.get("id");
                String name = (String) gData.get("name");
                Genre genre = genreRepository.findById(id).orElseGet(() -> 
                    genreRepository.save(new Genre(id, name, new HashSet<>()))
                );
                game.getGenres().add(genre);
            }
        }
    }

    private void processCategories(Map<String, Object> data, Game game) {
        List<Map<String, Object>> categoriesData = (List<Map<String, Object>>) data.get("categories");
        if (categoriesData != null) {
            for (Map<String, Object> cData : categoriesData) {
                Integer id = (Integer) cData.get("id");
                String name = (String) cData.get("name");
                Category category = categoryRepository.findById(id).orElseGet(() -> 
                    categoryRepository.save(new Category(id, name, new HashSet<>()))
                );
                game.getCategories().add(category);
            }
        }
    }

    private void processDevelopers(Map<String, Object> data, Game game) {
        List<String> developersData = (List<String>) data.get("developers");
        if (developersData != null) {
            for (String name : developersData) {
                Developer developer = developerRepository.findByName(name).orElseGet(() -> 
                    developerRepository.save(new Developer(null, name, new HashSet<>()))
                );
                game.getDevelopers().add(developer);
            }
        }
    }

    private void processPublishers(Map<String, Object> data, Game game) {
        List<String> publishersData = (List<String>) data.get("publishers");
        if (publishersData != null) {
            for (String name : publishersData) {
                Publisher publisher = publisherRepository.findByName(name).orElseGet(() -> 
                    publisherRepository.save(new Publisher(null, name, new HashSet<>()))
                );
                game.getPublishers().add(publisher);
            }
        }
    }

    private void processTags(Map<String, Object> data, Game game) {
        List<Map<String, Object>> tagsData = (List<Map<String, Object>>) data.get("tags");
        if (tagsData != null) {
            for (Map<String, Object> tData : tagsData) {
                String name = (String) tData.get("tag");
                Tag tag = tagRepository.findByName(name).orElseGet(() -> 
                    tagRepository.save(new Tag(name))
                );
                game.getTags().add(tag);
            }
        }
    }

    private void processScreenshots(Map<String, Object> data, Game game) {
        List<Map<String, Object>> screenshotsData = (List<Map<String, Object>>) data.get("screenshots");
        if (screenshotsData != null) {
            for (Map<String, Object> sData : screenshotsData) {
                Screenshot ss = Screenshot.builder()
                        .game(game)
                        .gameId(game.getId())
                        .steamId((Integer) sData.get("steam_id"))
                        .pathThumbnail((String) sData.get("path_thumbnail"))
                        .pathFull((String) sData.get("path_full"))
                        .displayOrder((Integer) sData.get("display_order"))
                        .build();
                game.getScreenshots().add(ss);
            }
        }
    }

    private int parseIntSafe(Object value) {
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof String) {
            try { return Integer.parseInt((String) value); } catch (Exception e) { return 0; }
        }
        return 0;
    }
}
