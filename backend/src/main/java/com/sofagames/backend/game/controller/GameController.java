package com.sofagames.backend.game.controller;

import com.sofagames.backend.game.dto.GameSummaryDTO;
import com.sofagames.backend.game.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController = @Controller + @ResponseBody
// Le dice a Spring que esta clase maneja peticiones HTTP
// y que las respuestas se convierten a JSON automáticamente.
@RestController

// Todas las rutas de esta clase empiezan con /api/v1/games
@RequestMapping("/api/v1/games")

// @CrossOrigin permite que el frontend (en otro puerto) pueda llamar a esta API.
// En desarrollo el frontend corre en localhost:5173 (Vite) o localhost:3000 (CRA).
// En producción esto se maneja en CorsConfig.java de forma global.
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GameController {

    private final GameService gameService;

    // Spring inyecta GameService automáticamente (inyección por constructor).
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

        // Delegamos todo el trabajo al service.
        // El controller no sabe nada de la BD — eso es responsabilidad del service.
        Page<GameSummaryDTO> games = gameService.getAllGames(pageable);

        // ResponseEntity.ok() devuelve HTTP 200 + el objeto games como JSON.
        // Spring (Jackson) convierte Page<GameSummaryDTO> a JSON automáticamente:
        // { "content": [...], "totalPages": 5, "totalElements": 98, ... }
        return ResponseEntity.ok(games);
    }
}
