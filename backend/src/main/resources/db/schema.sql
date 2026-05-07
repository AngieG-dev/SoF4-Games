-- =================================================================
-- SoF4-Games — Database Schema
-- PostgreSQL 16 (Neon.tech)
-- Convention: snake_case, plural table names
--
-- Groups:
--   1. Authentication & User Profile
--   2. Games Catalog
--   3. Social
--   4. Commerce
--   5. Future Growth
--   6. Indexes
-- =================================================================


-- =================================================================
-- GROUP 1: Authentication & User Profile
-- =================================================================

CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Separated from users: public profile info, managed independently from credentials.
-- Spring Security only needs the users table to authenticate.
CREATE TABLE user_profiles (
    id              UUID            PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name    VARCHAR(100),
    username        VARCHAR(50)     UNIQUE,  -- vanity URL, e.g. /profile/raiksha
    bio             TEXT,
    avatar_url      TEXT,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);


-- =================================================================
-- GROUP 2: Games Catalog
-- =================================================================

CREATE TABLE games (
    id                      BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    steam_appid             INTEGER         NOT NULL UNIQUE,
    name                    VARCHAR(255)    NOT NULL,
    short_description       TEXT,
    header_image            TEXT,           -- Steam CDN URL (600x338)
    capsule_image           TEXT,           -- Steam CDN URL (small card)
    background_raw          TEXT,           -- Steam CDN URL (game detail page background)
    website                 VARCHAR(255),
    is_free                 BOOLEAN         NOT NULL DEFAULT FALSE,
    price_initial           INTEGER         NOT NULL DEFAULT 0,     -- in cents (e.g. 3199900 = CLP$31.999)
    price_final             INTEGER         NOT NULL DEFAULT 0,     -- in cents, after discount
    discount_percent        INTEGER         NOT NULL DEFAULT 0,     -- 0-100
    currency                VARCHAR(10),                            -- e.g. 'CLP', 'USD'
    release_date            DATE,
    coming_soon             BOOLEAN         NOT NULL DEFAULT FALSE,
    required_age            INTEGER         NOT NULL DEFAULT 0,
    controller_support      VARCHAR(20),                            -- 'full', 'partial', or NULL
    supported_languages     TEXT,
    recommendations_total   INTEGER         NOT NULL DEFAULT 0,
    achievements_total      INTEGER         NOT NULL DEFAULT 0,
    system_requirements     JSONB,          -- stores pc/mac/linux requirements as structured JSON
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Genre catalog using Steam's own IDs (e.g. 1=Action, 25=Adventure)
CREATE TABLE genres (
    id      INTEGER         PRIMARY KEY,    -- Steam's genre ID
    name    VARCHAR(100)    NOT NULL
);

-- N:M between games and genres
CREATE TABLE game_genres (
    game_id     BIGINT      NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    genre_id    INTEGER     NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

-- Category catalog using Steam's own IDs (e.g. 2=Single-player, 1=Multi-player)
CREATE TABLE categories (
    id      INTEGER         PRIMARY KEY,    -- Steam's category ID
    name    VARCHAR(100)    NOT NULL
);

-- N:M between games and categories
CREATE TABLE game_categories (
    game_id         BIGINT      NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    category_id     INTEGER     NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
);

CREATE TABLE developers (
    id      BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(255)    NOT NULL UNIQUE
);

-- N:M between games and developers (one game can have multiple devs)
CREATE TABLE game_developers (
    game_id         BIGINT  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    developer_id    BIGINT  NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, developer_id)
);

CREATE TABLE publishers (
    id      BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(255)    NOT NULL UNIQUE
);

-- N:M between games and publishers
CREATE TABLE game_publishers (
    game_id         BIGINT  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    publisher_id    BIGINT  NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, publisher_id)
);

-- Screenshots per game, preserving Steam's original display order
CREATE TABLE screenshots (
    id              BIGINT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id         BIGINT  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    steam_id        INTEGER NOT NULL,
    path_thumbnail  TEXT    NOT NULL,   -- 600x338
    path_full       TEXT    NOT NULL,   -- 1920x1080
    display_order   INTEGER NOT NULL DEFAULT 0
);


-- =================================================================
-- GROUP 3: Social
-- =================================================================

-- A single row represents the full friendship relationship.
-- requester_id: who sent the request.
-- addressee_id: who received it.
-- To get all friends of user X: query rows where requester_id = X OR addressee_id = X AND status = 'ACCEPTED'.
CREATE TABLE friendships (
    id              BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    requester_id    UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id    UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                                    CHECK (status IN ('PENDING', 'ACCEPTED', 'BLOCKED')),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (requester_id, addressee_id),
    CHECK (requester_id != addressee_id)    -- a user cannot friend themselves
);


-- =================================================================
-- GROUP 4: Commerce
-- =================================================================

-- Represents the user's library (completed purchases).
-- ON DELETE RESTRICT on game_id: a game cannot be deleted if someone has purchased it.
-- This protects purchase history integrity.
CREATE TABLE purchases (
    id              BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id         BIGINT      NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    price_paid      INTEGER     NOT NULL DEFAULT 0,     -- in cents at time of purchase
    purchased_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, game_id)   -- a user cannot purchase the same game twice
);

-- Active shopping cart. Cleared on checkout (rows deleted, purchases inserted — in one transaction).
-- ON DELETE CASCADE on game_id: if a game is removed, it is automatically cleared from all carts.
CREATE TABLE cart_items (
    id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id     BIGINT      NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, game_id)   -- a user cannot add the same game to the cart twice
);


-- =================================================================
-- GROUP 5: Future Growth
-- =================================================================

-- Wishlist: not required for MVP, but trivial to add now.
-- Avoids schema changes if implemented in a future sprint.
CREATE TABLE wishlists (
    id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id     BIGINT      NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, game_id)
);


-- =================================================================
-- GROUP 6: Indexes
-- =================================================================

-- users
CREATE INDEX idx_users_email ON users(email);

-- games — columns commonly used for filtering and searching
CREATE INDEX idx_games_steam_appid     ON games(steam_appid);
CREATE INDEX idx_games_name            ON games(name);
CREATE INDEX idx_games_is_free         ON games(is_free);
CREATE INDEX idx_games_price_final     ON games(price_final);
CREATE INDEX idx_games_discount        ON games(discount_percent);
CREATE INDEX idx_games_release_date    ON games(release_date);

-- screenshots — always queried by game
CREATE INDEX idx_screenshots_game_id ON screenshots(game_id);

-- friendships — queried in both directions + by status
CREATE INDEX idx_friendships_requester  ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee  ON friendships(addressee_id);
CREATE INDEX idx_friendships_status     ON friendships(status);

-- purchases — most common query: "what has this user bought?"
CREATE INDEX idx_purchases_user_id  ON purchases(user_id);
CREATE INDEX idx_purchases_game_id  ON purchases(game_id);

-- cart
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- wishlists
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
