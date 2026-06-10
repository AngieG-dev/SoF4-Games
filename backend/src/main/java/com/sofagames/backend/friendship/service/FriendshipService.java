package com.sofagames.backend.friendship.service;

import com.sofagames.backend.auth.entity.User;
import com.sofagames.backend.auth.repository.UserRepository;
import com.sofagames.backend.friendship.dto.FriendDTO;
import com.sofagames.backend.friendship.dto.PendingRequestDTO;
import com.sofagames.backend.friendship.dto.SentRequestDTO;
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
    private final UserRepository       userRepository;

    // ── Enviar solicitud ──

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

    // ── Aceptar solicitud ──

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

    // ── Ignorar/rechazar solicitud recibida ──

    public void ignoreRequest(Long friendshipId, UUID userId) {

        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitud de amistad no encontrada"));

        if (!friendship.getAddressee().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Solo el destinatario puede ignorar esta solicitud");
        }

        friendshipRepository.delete(friendship);
    }

    // ── Cancelar solicitud enviada ──

    public void cancelRequest(Long friendshipId, UUID userId) {

        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitud de amistad no encontrada"));

        if (!friendship.getRequester().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Solo quien envió puede cancelar esta solicitud");
        }

        if (!"PENDING".equals(friendship.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Solo se pueden cancelar solicitudes pendientes");
        }

        friendshipRepository.delete(friendship);
    }

    // ── Eliminar amigo ──

    public void removeFriend(Long friendshipId, UUID userId) {

        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Amistad no encontrada"));

        boolean isParticipant =
                friendship.getRequester().getId().equals(userId) ||
                        friendship.getAddressee().getId().equals(userId);

        if (!isParticipant) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "No tienes permiso para eliminar esta amistad");
        }

        if (!"ACCEPTED".equals(friendship.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Solo se pueden eliminar amistades aceptadas");
        }

        friendshipRepository.delete(friendship);
    }

    // ── Lista de amigos aceptados ──

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
                            friendship.getId(),
                            friend.getId(),
                            profile != null ? profile.getDisplayName() : null,
                            profile != null ? profile.getUsername()    : null,
                            profile != null ? profile.getAvatarUrl()   : null
                    );
                })
                .toList();
    }

    // ── Solicitudes pendientes recibidas ──

    public List<PendingRequestDTO> getPendingRequests(UUID userId) {

        return friendshipRepository
                .findPendingRequestsReceived(userId)
                .stream()
                .map(friendship -> {
                    User requester = friendship.getRequester();
                    var profile    = requester.getUserProfile();

                    return new PendingRequestDTO(
                            friendship.getId(),
                            requester.getId(),
                            profile != null ? profile.getUsername()    : null,
                            profile != null ? profile.getDisplayName() : null,
                            profile != null ? profile.getAvatarUrl()   : null
                    );
                })
                .toList();
    }

    // ── Solicitudes pendientes enviadas ──

    public List<SentRequestDTO> getSentRequests(UUID userId) {

        return friendshipRepository
                .findPendingRequestsSent(userId)
                .stream()
                .map(friendship -> {
                    User addressee = friendship.getAddressee();
                    var profile    = addressee.getUserProfile();

                    return new SentRequestDTO(
                            friendship.getId(),
                            addressee.getId(),
                            profile != null ? profile.getUsername()    : null,
                            profile != null ? profile.getDisplayName() : null,
                            profile != null ? profile.getAvatarUrl()   : null
                    );
                })
                .toList();
    }
}