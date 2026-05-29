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