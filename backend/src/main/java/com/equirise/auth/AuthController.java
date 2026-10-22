package com.equirise.auth;

import com.equirise.auth.Dtos.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String ACCESS = "eq_access";   // short-lived, httpOnly
    private static final String REFRESH = "eq_refresh"; // idle-timeout window, httpOnly
    private static final String SEEN = "eq_seen";       // "signed in before" flag on this device

    private final SupabaseAuthClient supabase;
    private final boolean secure;
    private final Duration seenTtl;
    private final Duration idleTtl;

    public AuthController(SupabaseAuthClient supabase,
                          @Value("${app.cookie-secure}") boolean secure,
                          @Value("${app.signed-in-before-days}") long seenDays,
                          @Value("${app.idle-timeout-days}") long idleDays) {
        this.supabase = supabase;
        this.secure = secure;
        this.seenTtl = Duration.ofDays(seenDays);
        this.idleTtl = Duration.ofDays(idleDays);
    }

    @PostMapping("/login")
    public UserDto login(@Valid @RequestBody LoginRequest req, HttpServletResponse res) {
        TokenResponse t = supabase.signIn(req.email().trim().toLowerCase(), req.password());
        writeSession(res, t);
        return t.user();
    }

    /**
     * Entry logic from the spec:
     *  valid session                         -> SIGNED_IN (landing page)
     *  expired session, device seen before   -> EXPIRED   (2.1 Sign in)
     *  neither                               -> NEW       (0 Welcome)
     */
    @GetMapping("/session")
    public SessionResponse session(
            @CookieValue(name = ACCESS, required = false) String access,
            @CookieValue(name = REFRESH, required = false) String refresh,
            @CookieValue(name = SEEN, required = false) String seen,
            HttpServletResponse res) {

        if (access != null) {
            var user = supabase.getUser(access);
            if (user.isPresent()) return new SessionResponse("SIGNED_IN", user.get());
        }
        if (refresh != null) {
            var renewed = supabase.refresh(refresh);
            if (renewed.isPresent()) {
                writeSession(res, renewed.get());
                return new SessionResponse("SIGNED_IN", renewed.get().user());
            }
            clear(res, ACCESS);
            clear(res, REFRESH);
        }
        return new SessionResponse(seen != null ? "EXPIRED" : "NEW", null);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(name = ACCESS, required = false) String access,
                       HttpServletResponse res) {
        if (access != null) supabase.signOut(access);
        clear(res, ACCESS);
        clear(res, REFRESH);
        // SEEN stays on purpose: the next visit shows "Welcome back" instead of the first-time Welcome.
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        supabase.recover(req.email().trim().toLowerCase());
        // Always 204 so the response never reveals whether an email is registered.
    }

    private void writeSession(HttpServletResponse res, TokenResponse t) {
        add(res, ACCESS, t.accessToken(), Duration.ofSeconds(t.expiresIn()));
        add(res, REFRESH, t.refreshToken(), idleTtl);
        add(res, SEEN, "1", seenTtl);
    }

    private void clear(HttpServletResponse res, String name) {
        add(res, name, "", Duration.ZERO);
    }

    private void add(HttpServletResponse res, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
