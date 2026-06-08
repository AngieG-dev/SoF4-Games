package com.sofagames.backend.game.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO de respuesta para el detalle completo de un juego.
 * Se construye en GameService a partir de la entidad Game y sus relaciones.
 */
public record GameDetailDTO(

        // Datos básicos
        Long    id,
        Integer steamAppId,
        String  name,
        String  shortDescription,
        String  detailedDescription,
        String  headerImage,
        String  backgroundRaw,

        // Precio
        Boolean isFree,
        Integer priceFinal,
        Integer priceInitial,
        Integer discountPercent,
        String  currency,

        // Info adicional
        LocalDate releaseDate,
        Integer   requiredAge,
        String    controllerSupport,
        String    supportedLanguages,
        Integer   recommendationsTotal,
        Integer   achievementsTotal,
        String    systemRequirements,

        // Relaciones — listas de sub-objetos
        List<GenreDTO>      genres,
        List<CategoryDTO>   categories,
        List<String>        developers,
        List<String>        publishers,
        List<ScreenshotDTO> screenshots

) {
    // ── Sub-records: representan cada ítem de las listas ──

    public record GenreDTO(Integer id, String name) {}

    public record CategoryDTO(Integer id, String name) {}

    public record ScreenshotDTO(
            Long   id,
            String pathThumbnail,
            String pathFull,
            Integer displayOrder
    ) {}
}