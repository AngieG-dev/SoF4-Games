package com.sofagames.backend.library.service;

import com.sofagames.backend.checkout.entity.Purchase;
import com.sofagames.backend.checkout.repository.PurchaseRepository;
import com.sofagames.backend.library.dto.LibraryItemDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LibraryService {
    private final PurchaseRepository purchaseRepository;

    @Transactional(readOnly = true)
    public List<LibraryItemDTO> getUserLibrary(UUID userId) {
            return purchaseRepository.findByUserId(userId)
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    private LibraryItemDTO toDTO(Purchase purchase) {
        return new LibraryItemDTO(
                purchase.getGame().getSteamAppId(),
                purchase.getGame().getName(),
                purchase.getGame().getHeaderImage(),
                purchase.getPurchasedAt()
        );
    }
}
