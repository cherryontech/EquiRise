package com.equirise.auth;

import com.equirise.auth.Dtos.TokenResponse;
import com.equirise.auth.Dtos.UserDto;
import com.equirise.config.SupabaseProperties;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

/** Thin wrapper around the Supabase Auth (GoTrue) REST API. */
@Component
public class SupabaseAuthClient {

    private final RestClient http;

    public SupabaseAuthClient(SupabaseProperties props, RestClient.Builder builder) {
        this.http = builder
                .baseUrl(props.url() + "/auth/v1")
                .defaultHeader("apikey", props.publishableKey())
                .build();
    }

    public TokenResponse signIn(String email, String password) {
        try {
            return http.post()
                    .uri("/token?grant_type=password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("email", email, "password", password))
                    .retrieve()
                    .body(TokenResponse.class);
        } catch (HttpClientErrorException e) {
            throw new InvalidCredentialsException();
        }
    }

    public Optional<TokenResponse> refresh(String refreshToken) {
        try {
            return Optional.ofNullable(http.post()
                    .uri("/token?grant_type=refresh_token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("refresh_token", refreshToken))
                    .retrieve()
                    .body(TokenResponse.class));
        } catch (HttpClientErrorException e) {
            return Optional.empty();
        }
    }

    public Optional<UserDto> getUser(String accessToken) {
        try {
            return Optional.ofNullable(http.get()
                    .uri("/user")
                    .headers(h -> h.setBearerAuth(accessToken))
                    .retrieve()
                    .body(UserDto.class));
        } catch (HttpClientErrorException e) {
            return Optional.empty();
        }
    }

    public void recover(String email) {
        http.post()
                .uri("/recover")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("email", email))
                .retrieve()
                .toBodilessEntity();
    }

    public void signOut(String accessToken) {
        try {
            http.post()
                    .uri("/logout")
                    .headers(h -> h.setBearerAuth(accessToken))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ignored) {
            // token already invalid: nothing to revoke
        }
    }
}
