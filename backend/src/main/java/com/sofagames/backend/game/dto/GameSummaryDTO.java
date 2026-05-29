package com.sofagames.backend.game.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameSummaryDTO {

    @JsonProperty("steam_appid")
    private Integer steamAppId;

    private String name;

    @JsonProperty("header_image")
    private String headerImage;

    @JsonProperty("price_overview")
    private PriceOverviewDTO priceOverview;

    @JsonProperty("is_free")
    private Boolean isFree;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceOverviewDTO {

        private String currency;
        private Integer initial;

        @JsonProperty("final")
        private Integer finalPrice;

        @JsonProperty("discount_percent")
        private Integer discountPercent;

        @JsonProperty("initial_formatted")
        private String initialFormatted;

        @JsonProperty("final_formatted")
        private String finalFormatted;
    }
}