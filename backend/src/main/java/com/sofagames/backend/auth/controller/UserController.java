package com.sofagames.backend.auth.controller;

import com.sofagames.backend.auth.dto.ProfileDTO;
import com.sofagames.backend.auth.dto.UpdateProfileRequest;
import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.auth.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ProfileDTO getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        return userProfileService.getProfile(user.getId());
    }

    @PutMapping("/me")
    public ProfileDTO updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request
    ) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        return userProfileService.updateProfile(
                user.getId(),
                request
        );
    }
}
