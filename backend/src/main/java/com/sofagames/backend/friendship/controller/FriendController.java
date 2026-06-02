package com.sofagames.backend.friendship.controller;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.friendship.dto.FriendDTO;
import com.sofagames.backend.friendship.dto.FriendRequestDTO;
import com.sofagames.backend.friendship.model.Friendship;
import com.sofagames.backend.friendship.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendshipService friendshipService;

    /**
     * GET /api/v1/friends
     * Devuelve la lista de amigos aceptados del usuario autenticado.
     * Requiere JWT válido en el header Authorization.
     *
     * Respuesta: 200 OK con List<FriendDTO>.
     */
    @GetMapping
    public ResponseEntity<List<FriendDTO>> getFriends(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(friendshipService.getFriends(currentUser.getId()));
    }

    /**
     * POST /api/v1/friends/request
     * Envía una solicitud de amistad al usuario indicado en el body.
     * Requiere JWT válido en el header Authorization.
     *
     * Body: { "addresseeId": "uuid-del-destinatario" }
     * Respuesta: 201 Created con la Friendship creada.
     */
    @PostMapping("/request")
    public ResponseEntity<Friendship> sendRequest(
            @AuthenticationPrincipal User currentUser,
            @RequestBody @Valid FriendRequestDTO body
    ) {
        Friendship friendship = friendshipService.sendRequest(
                currentUser.getId(),
                body.addresseeId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(friendship);
    }

    /**
     * PUT /api/v1/friends/{id}/accept
     * Acepta la solicitud de amistad con el ID indicado.
     * Solo puede ejecutarlo el usuario que recibió la solicitud.
     * Requiere JWT válido en el header Authorization.
     *
     * Respuesta: 200 OK con la Friendship actualizada.
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<Friendship> acceptRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        Friendship friendship = friendshipService.acceptRequest(id, currentUser.getId());
        return ResponseEntity.ok(friendship);
    }
}