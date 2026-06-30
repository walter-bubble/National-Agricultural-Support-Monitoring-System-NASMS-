package com.Farm.NASMS.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userName) {
        return Jwts.builder()
                .subject(userName)                // updated: setSubject() deprecated in 0.12+
                .issuedAt(new Date())             // updated: setIssuedAt() deprecated in 0.12+
                .expiration(new Date(System.currentTimeMillis() + expiration)) // updated
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUserName(String token) {
        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(getSigningKey())      // fixed: pass SecretKey, not String
                .build()
                .parseSignedClaims(token);
        return claimsJws.getPayload().getSubject(); // fixed: extract the subject string
    }

    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUserName(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiry = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiry.before(new Date());
    }
}