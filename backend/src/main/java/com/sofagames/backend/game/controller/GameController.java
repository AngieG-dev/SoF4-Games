package com.sofagames.backend.game.controller;

import com.sofagames.backend.game.dto.GameSummaryDTO;
import com.sofagames.backend.game.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
     * GET /api/v1/games?page=0&size=20
     * GET /api/v1/games?page=1&size=10
     *
     * @PageableDefault define los valores por defecto si el frontend no manda nada:
     *   - page  = 0  (primera página)
     *   - size  = 20 (20 juegos por página)
     *
     * Spring convierte automáticamente los query params ?page=&size= en el objeto Pageable.
     * No tienes que leer los params a mano.
     *
     * ResponseEntity<Page<GameSummaryDTO>> = respuesta HTTP con código de estado + cuerpo JSON.
     */
    @GetMapping
    public ResponseEntity<Page<GameSummaryDTO>> getAllGames(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {

        Page<GameSummaryDTO> games = gameService.getAllGames(pageable);

        return ResponseEntity.ok(games);
    }
}
