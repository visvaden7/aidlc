package com.tableorder.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long adminExpirationMs;
    private final long tableExpirationMs;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.admin-expiration-hours}") long adminHours,
            @Value("${jwt.table-expiration-hours}") long tableHours) {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        this.adminExpirationMs = adminHours * 60 * 60 * 1000;
        this.tableExpirationMs = tableHours * 60 * 60 * 1000;
    }

    public String generateAdminToken(Long adminUserId, Long storeId) {
        return Jwts.builder()
                .subject(String.valueOf(adminUserId))
                .claim("storeId", storeId)
                .claim("role", "ADMIN")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + adminExpirationMs))
                .signWith(key)
                .compact();
    }

    public String generateTableToken(Long tableId, Long storeId) {
        return Jwts.builder()
                .subject(String.valueOf(tableId))
                .claim("storeId", storeId)
                .claim("role", "TABLE")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + tableExpirationMs))
                .signWith(key)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getSubjectId(Claims claims) {
        return Long.parseLong(claims.getSubject());
    }

    public Long getStoreId(Claims claims) {
        return claims.get("storeId", Long.class);
    }

    public String getRole(Claims claims) {
        return claims.get("role", String.class);
    }
}
