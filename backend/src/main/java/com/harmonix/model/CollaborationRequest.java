package com.harmonix.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("collaboration_requests")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollaborationRequest {
    @Id
    private String id;
    private String creatorId;
    private String creatorEmail;
    private String title;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}



