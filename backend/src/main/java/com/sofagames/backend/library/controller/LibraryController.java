package com.sofagames.backend.library.controller;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.config.JwtUtil;
import com.sofagames.backend.library.dto.LibraryItemDTO;
import com.sofagames.backend.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LibraryItemDTO>> getLibrary(
            @RequestHeader("Authorization") String authHeader) {

        UUID userId = extractUserId(authHeader);
        return ResponseEntity.ok(libraryService.getUserLibrary(userId));
    }

    private UUID extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return user.getId();
    }
}