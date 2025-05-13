package com.harmonix.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "drfhxdkmp");
        config.put("api_key", "436514745658548");
        config.put("api_secret", "GiTic6j4LOjSWS3Zj0bODJk2f-Y");
        return new Cloudinary(config);
    }
}
