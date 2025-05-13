package com.harmonix.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "messages")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    private String id;

    private String chatId;
    private String senderId;
    private String receiverId;

    private String message;
    private String type;
    private String mediaUrl;

    private String status;
    private Instant timestamp;
}
