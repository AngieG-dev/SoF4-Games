package com.sofagames.backend.auth.service;

import com.sofagames.backend.auth.dto.AuthResponse;
import com.sofagames.backend.auth.dto.LoginRequest;
import com.sofagames.backend.auth.dto.RegisterRequest;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
