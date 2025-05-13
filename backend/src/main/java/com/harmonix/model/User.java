package com.harmonix.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("users")
public class User {

    @Id
    private String id;
    private String email;
    private String name;
    private String profileImage;
    private String userType;

    public User() {}

    public User(String id, String email, String name, String profileImage, String userType) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.profileImage = profileImage;
        this.userType = userType;
    }
}
