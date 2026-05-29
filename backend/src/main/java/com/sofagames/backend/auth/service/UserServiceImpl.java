package com.sofagames.backend.auth.service;

import com.sofagames.backend.auth.dto.AuthResponse;
import com.sofagames.backend.auth.dto.LoginRequest;
import com.sofagames.backend.auth.dto.RegisterRequest;
import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.entity.UserProfile;
import com.sofagames.backend.auth.exception.EmailAlreadyExistsException;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        UserProfile profile = UserProfile.builder()
                .username(request.getUsername())
                .user(user)
                .build();

        user.setUserProfile(profile);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), profile.getUsername());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        String username = user.getUserProfile() != null ? user.getUserProfile().getUsername() : "";
        return new AuthResponse(token, user.getEmail(), username);
    }
}
