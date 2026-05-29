package com.sofagames.backend.game.repository;

import com.sofagames.backend.game.entity.Screenshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenshotRepository extends JpaRepository<Screenshot, Long> {
}
