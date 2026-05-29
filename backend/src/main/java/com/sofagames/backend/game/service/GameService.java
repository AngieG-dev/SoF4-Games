package com.sofagames.backend.game.service;

import com.sofagames.backend.game.dto.GameSummaryDTO;
import com.sofagames.backend.game.entity.Game;
import com.sofagames.backend.game.repository.GameRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public Page<GameSummaryDTO> getAllGames(Pageable pageable) {
        Page<Game> gamePage = gameRepository.findAll(pageable);
        return gamePage.map(this::toSummaryDTO);
    }

    // ── Convierte una entidad Game a GameSummaryDTO ───────────────────────────
    // Separado en método privado para que sea más legible.
    private GameSummaryDTO toSummaryDTO(Game game) {

        // Construimos el price_overview solo si el juego no es gratis.
        // Si es gratis, mandamos null — igual que hacen los mocks.
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
                    formatPrice(initial, currency),   // "CLP$ 16.990"
                    formatPrice(finalPrice, currency) // "CLP$ 8.495"
            );
        }

        return new GameSummaryDTO(
                game.getSteamAppId(),
                game.getName(),
                game.getHeaderImage(),
                priceOverview,
                game.getIsFree()
        );
    }

    // ── Formatea un precio en centavos a string legible ───────────────────────
    // Ejemplos:
    //   formatPrice(1699000, "CLP") → "CLP$ 16.990"
    //   formatPrice(849500,  "CLP") → "CLP$ 8.495"
    //
    // Los precios en la BD están en centavos (×100).
    // CLP no usa decimales → dividimos entre 100 y formateamos con puntos de miles.
    private String formatPrice(int cents, String currency) {
        long units = cents / 100; // 1699000 → 16990

        // Formato manual con puntos de miles para CLP (sin decimales).
        // String.format no soporta puntos como separador de miles directamente,
        // así que usamos java.text.NumberFormat.
        java.text.NumberFormat nf = java.text.NumberFormat.getIntegerInstance(
                new java.util.Locale("es", "CL") // locale chileno: puntos de miles
        );
        return currency + "$ " + nf.format(units); // "CLP$ 16.990"
    }
}