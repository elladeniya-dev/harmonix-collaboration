package com.harmonix.service;

import com.harmonix.model.Message;
import com.harmonix.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatHeadService chatHeadService;

    public MessageService(MessageRepository messageRepository, ChatHeadService chatHeadService) {
        this.messageRepository = messageRepository;
        this.chatHeadService = chatHeadService;
    }

    public Message sendMessage(Message message) {
        message.setTimestamp(Instant.now());
        Message saved = messageRepository.save(message);
        chatHeadService.updateChatHeadFromMessage(saved);
        return saved;
    }

    public List<Message> getChatHistory(String chatId) {
        return messageRepository.findTop50ByChatIdOrderByTimestampDesc(chatId);
    }
    public void send(Message message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(Instant.now());
        }
        messageRepository.save(message);
    }

}
