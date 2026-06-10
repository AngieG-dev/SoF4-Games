package com.sofagames.backend.auth.controller;

import com.sofagames.backend.auth.dto.UserSearchDTO;
import com.sofagames.backend.auth.dto.ProfileDTO;
import com.sofagames.backend.auth.dto.UpdateProfileRequest;
import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.auth.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /**
     * GET /api/v1/users/search?q=texto
     * Busca usuarios por username o displayName (case-insensitive, contiene).
     * Devuelve máximo 10 resultados, excluyendo al usuario autenticado.
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(
            @RequestParam String q,
            @AuthenticationPrincipal User currentUser
    ) {
        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.ok(List.of());
        }

        List<UserSearchDTO> results = userRepository.searchByUsername(q.trim())
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .limit(10)
                .map(user -> {
                    var profile = user.getUserProfile();
                    return new UserSearchDTO(
                            user.getId(),
                            profile != null ? profile.getUsername()    : null,
                            profile != null ? profile.getDisplayName() : null,
                            profile != null ? profile.getAvatarUrl()   : null
                    );
                })
                .toList();

        return ResponseEntity.ok(results);
    }
}
