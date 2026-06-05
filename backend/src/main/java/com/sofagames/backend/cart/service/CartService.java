package com.sofagames.backend.cart.service;

import com.sofagames.backend.cart.dto.CartItemDTO;
import com.sofagames.backend.cart.entity.CartItem;
import com.sofagames.backend.cart.repository.CartItemRepository;
import com.sofagames.backend.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItemDTO> getCartItems(UUID userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .toList();
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