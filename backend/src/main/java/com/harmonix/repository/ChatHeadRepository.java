package com.harmonix.repository;

import com.harmonix.model.ChatHead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

public interface ChatHeadRepository extends MongoRepository<ChatHead, String> {
    List<ChatHead> findByParticipantsContaining(String userId);

    @Override
    @NonNull
    Optional<ChatHead> findById(@NonNull String id);
}
