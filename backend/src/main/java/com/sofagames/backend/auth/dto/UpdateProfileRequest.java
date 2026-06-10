package com.sofagames.backend.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String displayName;
    private String username;
    private String bio;
}
