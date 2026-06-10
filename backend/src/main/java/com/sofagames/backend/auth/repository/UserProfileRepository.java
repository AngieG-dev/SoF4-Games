package com.sofagames.backend.auth.repository;

import com.sofagames.backend.auth.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    boolean existsByUsernameAndIdNot(String username, UUID id);
}
