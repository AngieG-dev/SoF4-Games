package com.sofagames.backend.game.service;

import org.springframework.transaction.annotation.Transactional;
import com.sofagames.backend.game.dto.GameDetailDTO;
import com.sofagames.backend.game.dto.GameSummaryDTO;
import com.sofagames.backend.game.entity.Game;
import com.sofagames.backend.game.repository.GameRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // ── Método existente: lista paginada ──

    public Page<GameSummaryDTO> getAllGames(Pageable pageable) {
        Page<Game> gamePage = gameRepository.findAll(pageable);
        return gamePage.map(this::toSummaryDTO);
    }

    // ── Método nuevo: detalle de un juego por ID ──

    /**
     * Busca un juego por su ID interno (no el steamAppId).
     * Si no existe, lanza un 404.
     * Si existe, mapea la entidad Game a GameDetailDTO.
     *
     * @param id  ID interno del juego (columna "id" en la tabla games)
     * @return    GameDetailDTO con todos los datos del juego
     */
    @Transactional(readOnly = true)
    public GameDetailDTO getGameById(Long id) {

        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Juego no encontrado"));

        return toDetailDTO(game);
    }

    // ── Métodos de mapeo privados ──

    private GameDetailDTO toDetailDTO(Game game) {

        // Géneros: Set<Genre> → List<GenreDTO>
        List<GameDetailDTO.GenreDTO> genres = game.getGenres()
                .stream()
                .map(g -> new GameDetailDTO.GenreDTO(g.getId(), g.getName()))
                .toList();

        // Categorías: Set<Category> → List<CategoryDTO>
        List<GameDetailDTO.CategoryDTO> categories = game.getCategories()
                .stream()
                .map(c -> new GameDetailDTO.CategoryDTO(c.getId(), c.getName()))
                .toList();

        // Developers: Set<Developer> → List<String> (solo el nombre)
        List<String> developers = game.getDevelopers()
                .stream()
                .map(d -> d.getName())
                .toList();

        // Publishers: Set<Publisher> → List<String> (solo el nombre)
        List<String> publishers = game.getPublishers()
                .stream()
                .map(p -> p.getName())
                .toList();

        // Screenshots: Set<Screenshot> → List<ScreenshotDTO> ordenados por displayOrder
        List<GameDetailDTO.ScreenshotDTO> screenshots = game.getScreenshots()
                .stream()
                .sorted(Comparator.comparing(s -> s.getDisplayOrder()))
                .map(s -> new GameDetailDTO.ScreenshotDTO(
                        s.getId(),
                        s.getPathThumbnail(),
                        s.getPathFull(),
                        s.getDisplayOrder()
                ))
                .toList();

        return new GameDetailDTO(
                game.getId(),
                game.getSteamAppId(),
                game.getName(),
                game.getShortDescription(),
                game.getDetailedDescription(),
                game.getHeaderImage(),
                game.getBackgroundRaw(),
                game.getIsFree(),
                game.getPriceFinal(),
                game.getPriceInitial(),
                game.getDiscountPercent(),
                game.getCurrency(),
                game.getReleaseDate(),
                game.getRequiredAge(),
                game.getControllerSupport(),
                game.getSupportedLanguages(),
                game.getRecommendationsTotal(),
                game.getAchievementsTotal(),
                game.getSystemRequirements(),
                genres,
                categories,
                developers,
                publishers,
                screenshots
        );
    }

    private GameSummaryDTO toSummaryDTO(Game game) {

        GameSummaryDTO.PriceOverviewDTO priceOverview = null;

        if (!Boolean.TRUE.equals(game.getIsFree())) {
            int initial         = game.getPriceInitial() != null ? game.getPriceInitial() : 0;
            int finalPrice      = game.getPriceFinal()   != null ? game.getPriceFinal()   : 0;
            int discountPct     = game.getDiscountPercent() != null ? game.getDiscountPercent() : 0;
            String currency     = game.getCurrency() != null ? game.getCurrency() : "CLP";

            priceOverview = new GameSummaryDTO.PriceOverviewDTO(
                    currency,
                    initial,
                    finalPrice,
                    discountPct,
                    formatPrice(initial, currency),
                    formatPrice(finalPrice, currency)
            );
        }

        return new GameSummaryDTO(
                game.getId(),
                game.getSteamAppId(),
                game.getName(),
                game.getHeaderImage(),
                priceOverview,
                game.getIsFree()
        );
    }

    private String formatPrice(int cents, String currency) {
        long units = cents / 100;

        java.text.NumberFormat nf = java.text.NumberFormat.getIntegerInstance(
                new java.util.Locale("es", "CL")
        );
        return currency + "$ " + nf.format(units);
    }
}