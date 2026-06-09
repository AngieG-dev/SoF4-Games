package com.sofagames.backend.cart.service;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.cart.dto.CartItemDTO;
import com.sofagames.backend.cart.entity.CartItem;
import com.sofagames.backend.cart.repository.CartItemRepository;
import com.sofagames.backend.game.entity.Game;
import com.sofagames.backend.game.repository.GameRepository;
import com.sofagames.backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    @Transactional(readOnly = true)
    public List<CartItemDTO> getCartItems(UUID userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public CartItemDTO addToCart(UUID userId, Long gameId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        if (cartItemRepository.existsByUserIdAndGameId(userId, gameId)) {
            throw new IllegalStateException("El juego ya está en el carrito");
        }

        CartItem item = CartItem.builder()
                .user(user)
                .game(game)
                .build();

        CartItem saved = cartItemRepository.save(item);
        return toDTO(saved);
    }

    @Transactional
    public void removeFromCart(UUID userId, Long gameId) {
        if (!cartItemRepository.existsByUserIdAndGameId(userId, gameId)) {
            throw new ResourceNotFoundException("Item not found in cart");
        }
        cartItemRepository.deleteByUserIdAndGameId(userId, gameId);
    }

    private CartItemDTO toDTO(CartItem item) {
        return new CartItemDTO(
                item.getGame().getId(),
                item.getGame().getSteamAppId(),
                item.getGame().getName(),
                item.getGame().getHeaderImage(),
                item.getGame().getPriceFinal(),
                item.getGame().getCurrency(),
                item.getAddedAt());
    }
}