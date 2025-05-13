package com.harmonix.repository;

import com.harmonix.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findTop50ByChatIdOrderByTimestampDesc(String chatId);
    void deleteByChatId(String chatId);

}
