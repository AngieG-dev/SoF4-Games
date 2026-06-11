package com.sofagames.backend.game.repository;

import com.sofagames.backend.game.entity.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByCollectionOrderByRecommendationsTotalDesc(
            String collection,
            Pageable pageable
    );

    List<Game> findByCollectionInOrderByTotalPositiveDesc(
            List<String> collections,
            Pageable pageable
    );

    List<Game> findByCollectionInOrderByReleaseDateDesc(
            List<String> collections,
            Pageable pageable
    );

    Page<Game> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );

    @Query("""
        SELECT g
        FROM Game g
        WHERE g.collection IN :collections
          AND g.discountPercent > 0
        ORDER BY g.discountPercent DESC
    """)
    List<Game> findDiscountedGames(
            @Param("collections") List<String> collections,
            Pageable pageable
    );
}
