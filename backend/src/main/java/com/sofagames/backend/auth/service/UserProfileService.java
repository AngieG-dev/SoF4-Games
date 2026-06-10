package com.sofagames.backend.auth.service;

import com.sofagames.backend.auth.dto.ProfileDTO;
import com.sofagames.backend.auth.dto.UpdateProfileRequest;
import com.sofagames.backend.auth.entity.UserProfile;
import com.sofagames.backend.auth.exception.UsernameAlreadyExistsException;
import com.sofagames.backend.auth.repository.UserProfileRepository;
import com.sofagames.backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public ProfileDTO getProfile(UUID userId) {

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado"));

        return toDto(profile);
    }

    public ProfileDTO updateProfile(UUID userId, UpdateProfileRequest request) {

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado"));

        if (request.getUsername() != null &&
                !request.getUsername().equals(profile.getUsername()) &&
                userProfileRepository.existsByUsernameAndIdNot(
                        request.getUsername(),
                        userId
                )) {

            throw new UsernameAlreadyExistsException(request.getUsername());
        }

        if (request.getDisplayName() != null) {
            profile.setDisplayName(request.getDisplayName());
        }

        if (request.getUsername() != null) {
            profile.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }

        UserProfile saved = userProfileRepository.save(profile);

        return toDto(saved);
    }

    private ProfileDTO toDto(UserProfile profile) {

        return ProfileDTO.builder()
                .userId(profile.getId())
                .email(profile.getUser().getEmail())
                .displayName(profile.getDisplayName())
                .username(profile.getUsername())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .build();
    }
}
