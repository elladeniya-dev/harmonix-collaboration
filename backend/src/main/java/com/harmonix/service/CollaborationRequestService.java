package com.harmonix.service;

import com.harmonix.model.CollaborationRequest;
import com.harmonix.repository.CollaborationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaborationRequestService {

    private final CollaborationRequestRepository repository;

    public CollaborationRequest create(CollaborationRequest req) {
        req.setCreatedAt(Instant.now());
        req.setUpdatedAt(Instant.now());
        return repository.save(req);
    }

    public CollaborationRequest accept(String id) {
        CollaborationRequest req = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setUpdatedAt(Instant.now());
        return repository.save(req);
    }

    public List<CollaborationRequest> getAllOpen() {
        return repository.findAll();
    }

    public List<CollaborationRequest> getByCreator(String creatorId) {
        return repository.findByCreatorId(creatorId);
    }

    public CollaborationRequest update(String id, CollaborationRequest updated, String userId) {
        CollaborationRequest existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!existing.getCreatorId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this request");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setUpdatedAt(Instant.now());

        return repository.save(existing);
    }

    public void delete(String id, String userId) {
        CollaborationRequest existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!existing.getCreatorId().equals(userId)) {
            throw new SecurityException("You can only delete your own requests");
        }

        repository.deleteById(id);
    }
}
