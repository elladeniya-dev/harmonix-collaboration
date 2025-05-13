package com.harmonix.security;

import com.harmonix.exception.UnauthorizedException;
import com.harmonix.model.User;
import com.harmonix.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class AuthHelper {

    public static User requireUser(HttpServletRequest request, UserRepository repo) {
        String token = extractTokenFromCookies(request);
        if (token == null) {
            throw new UnauthorizedException("Missing authentication token in cookies");
        }

        return getUserFromToken(token, repo);
    }


    public static User requireUser(String token, UserRepository repo) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Token is missing or blank");
        }
        return getUserFromToken(token, repo);
    }


    private static String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }


    private static User getUserFromToken(String token, UserRepository repo) {
        try {
            String email = JwtUtils.validateToken(token);
            return repo.findByEmail(email)
                    .orElseThrow(() -> new UnauthorizedException("No user found for email in token"));
        } catch (Exception e) {
            throw new UnauthorizedException("Token invalid or expired: " + e.getMessage());
        }
    }
}
