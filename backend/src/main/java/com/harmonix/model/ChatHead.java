package com.harmonix.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "chat_heads")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatHead {
    @Id
    private String id;

    private List<String> participants;
    private String lastMessage;
    private Instant lastUpdated;

    private String lastSenderId;
    private String lastMessageType;
    private boolean unread;
}
