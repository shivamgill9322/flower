package com.flowershop.dto;

public class AuthResponse {
    private String accessToken;
    private String email;
    private String name;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String email, String name, String message) {
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
        this.message = message;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
