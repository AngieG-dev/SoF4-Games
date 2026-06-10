package com.sofagames.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {

    private UUID userId;
    private String email;
    private String displayName;
    private String username;
    private String bio;
    private String avatarUrl;
}
