package com.sofagames.backend.game.controller;

import com.sofagames.backend.game.dto.GameDetailDTO;
import com.sofagames.backend.game.dto.GameSummaryDTO;
import com.sofagames.backend.game.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * GET /api/v1/games
     * Devuelve la lista paginada de juegos (endpoint existente, sin cambios).
     */
    @GetMapping
    public ResponseEntity<Page<GameSummaryDTO>> getAllGames(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {

        Page<GameSummaryDTO> games = gameService.getAllGames(pageable);
        return ResponseEntity.ok(games);
    }

    /**
     * GET /api/v1/games/{id}
     * Devuelve el detalle completo de un juego por su ID interno.
     * Endpoint público — no requiere JWT.
     *
     * Ejemplo: GET /api/v1/games/42
     * Respuesta: 200 OK con GameDetailDTO, o 404 si no existe.
     *
     * @param id  ID interno del juego (Long)
     */
    @GetMapping("/{id}")
    public ResponseEntity<GameDetailDTO> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getGameById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<GameSummaryDTO>> getFeaturedGames() {
        return ResponseEntity.ok(
                gameService.getFeaturedGames()
        );
    }

    @GetMapping("/sales")
    public ResponseEntity<List<GameSummaryDTO>> getSaleGames() {
        return ResponseEntity.ok(
                gameService.getSaleGames()
        );
    }

    @GetMapping("/recent")
    public ResponseEntity<List<GameSummaryDTO>> getRecentGames() {
        return ResponseEntity.ok(
                gameService.getRecentGames()
        );
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<GameSummaryDTO>> getTopRatedGames() {
        return ResponseEntity.ok(
                gameService.getTopRatedGames()
        );
    }
}