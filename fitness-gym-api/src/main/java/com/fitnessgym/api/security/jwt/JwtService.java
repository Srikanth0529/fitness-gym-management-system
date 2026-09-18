package com.fitnessgym.api.security.jwt;

import com.fitnessgym.api.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public String generateAccessToken(User user) {
        return generateToken(
                user,
                jwtProperties.getAccessTokenExpiration(),
                "ACCESS"
        );
    }

    public String generateRefreshToken(User user) {
        return generateToken(
                user,
                jwtProperties.getRefreshTokenExpiration(),
                "REFRESH"
        );
    }

    private String generateToken(
            User user,
            long expiration,
            String tokenType
    ) {
        Date issuedAt = new Date();

        Date expirationDate = new Date(
                issuedAt.getTime() + expiration
        );

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim(
                        "role",
                        user.getRole().getRoleName().name()
                )
                .claim("tokenType", tokenType)
                .issuedAt(issuedAt)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                jwtProperties
                        .getSecret()
                        .getBytes(StandardCharsets.UTF_8);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}