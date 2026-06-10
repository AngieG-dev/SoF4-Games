package com.sofagames.backend.friendship.controller;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.friendship.dto.FriendDTO;
import com.sofagames.backend.friendship.dto.FriendRequestDTO;
import com.sofagames.backend.friendship.dto.PendingRequestDTO;
import com.sofagames.backend.friendship.dto.SentRequestDTO;
import com.sofagames.backend.friendship.model.Friendship;
import com.sofagames.backend.friendship.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendshipService friendshipService;

    /** GET /api/v1/friends — lista de amigos aceptados */
    @GetMapping
    public ResponseEntity<List<FriendDTO>> getFriends(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(friendshipService.getFriends(currentUser.getId()));
    }

    /** GET /api/v1/friends/requests — solicitudes pendientes recibidas */
    @GetMapping("/requests")
    public ResponseEntity<List<PendingRequestDTO>> getPendingRequests(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(currentUser.getId()));
    }

    /** GET /api/v1/friends/requests/sent — solicitudes pendientes enviadas */
    @GetMapping("/requests/sent")
    public ResponseEntity<List<SentRequestDTO>> getSentRequests(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(friendshipService.getSentRequests(currentUser.getId()));
    }

    /** POST /api/v1/friends/request — enviar solicitud */
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> sendRequest(
            @AuthenticationPrincipal User currentUser,
            @RequestBody @Valid FriendRequestDTO body
    ) {
        Friendship friendship = friendshipService.sendRequest(
                currentUser.getId(),
                body.addresseeId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("id", friendship.getId(), "status", friendship.getStatus())
        );
    }

    /** PUT /api/v1/friends/{id}/accept — aceptar solicitud recibida */
    @PutMapping("/{id}/accept")
    public ResponseEntity<Map<String, Object>> acceptRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        Friendship friendship = friendshipService.acceptRequest(id, currentUser.getId());
        return ResponseEntity.ok(
                Map.of("id", friendship.getId(), "status", friendship.getStatus())
        );
    }

    /** PUT /api/v1/friends/{id}/ignore — ignorar solicitud recibida */
    @PutMapping("/{id}/ignore")
    public ResponseEntity<Void> ignoreRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        friendshipService.ignoreRequest(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    /** DELETE /api/v1/friends/request/{id} — cancelar solicitud enviada */
    @DeleteMapping("/request/{id}")
    public ResponseEntity<Void> cancelRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        friendshipService.cancelRequest(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    /** DELETE /api/v1/friends/{id} — eliminar amigo */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFriend(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        friendshipService.removeFriend(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}