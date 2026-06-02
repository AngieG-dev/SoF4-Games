package com.sofagames.backend.friendship.service;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.friendship.dto.FriendDTO;
import com.sofagames.backend.friendship.model.Friendship;
import com.sofagames.backend.friendship.repository.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    /**
     * Envía una solicitud de amistad del usuario autenticado hacia addresseeId.
     *
     * @param requesterId UUID del usuario que envía (viene del JWT, no del body)
     * @param addresseeId UUID del usuario que recibe (viene del body)
     * @return la Friendship recién creada con status = "PENDING"
     */
    public Friendship sendRequest(UUID requesterId, UUID addresseeId) {

        if (requesterId.equals(addresseeId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No puedes agregarte a ti mismo");
        }

        boolean alreadyExists =
                friendshipRepository.existsByRequesterIdAndAddresseeId(requesterId, addresseeId) ||
                        friendshipRepository.existsByRequesterIdAndAddresseeId(addresseeId, requesterId);

        if (alreadyExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Solicitud ya existente");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario solicitante no encontrado"));

        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario destinatario no encontrado"));

        Friendship friendship = Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status("PENDING")
                .build();

        return friendshipRepository.save(friendship);
    }

    /**
     * Acepta una solicitud de amistad existente.
     * Solo el addressee (quien recibió la solicitud) puede aceptarla.
     *
     * @param friendshipId ID de la fila en friendships
     * @param userId       UUID del usuario autenticado (debe ser el addressee)
     * @return la Friendship actualizada con status = "ACCEPTED"
     */
    public Friendship acceptRequest(Long friendshipId, UUID userId) {

        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitud de amistad no encontrada"));

        if (!friendship.getAddressee().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Solo el destinatario puede aceptar esta solicitud");
        }

        friendship.setStatus("ACCEPTED");
        return friendshipRepository.save(friendship);
    }

    /**
     * Devuelve la lista de amigos aceptados del usuario.
     * Cada amistad puede tener al usuario como requester O como addressee,
     * así que para cada fila identificamos quién es "el otro".
     *
     * @param userId UUID del usuario autenticado
     * @return lista de FriendDTO con los datos del perfil de cada amigo
     */
    public List<FriendDTO> getFriends(UUID userId) {

        return friendshipRepository
                .findAcceptedFriendships(userId, "ACCEPTED")
                .stream()
                .map(friendship -> {
                    User friend = friendship.getRequester().getId().equals(userId)
                            ? friendship.getAddressee()
                            : friendship.getRequester();

                    var profile = friend.getUserProfile();

                    return new FriendDTO(
                            friend.getId(),
                            profile != null ? profile.getDisplayName() : null,
                            profile != null ? profile.getUsername()    : null,
                            profile != null ? profile.getAvatarUrl()   : null
                    );
                })
                .toList();
    }
}