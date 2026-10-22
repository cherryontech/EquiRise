package com.equirise.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class Dtos {
    private Dtos() {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record ForgotPasswordRequest(@NotBlank @Email String email) {}

    public record UserDto(String id, String email) {}

    public record SessionResponse(String status, UserDto user) {}

    public record ErrorResponse(String message) {}

    /** Subset of Supabase's /auth/v1/token response. */
    public record TokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("refresh_token") String refreshToken,
            @JsonProperty("expires_in") long expiresIn,
            UserDto user) {}
}
