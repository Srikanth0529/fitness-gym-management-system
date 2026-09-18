package com.fitnessgym.api.security.jwt;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@ConfigurationProperties(prefix = "app.security.jwt")
public class JwtProperties {

    private String secret;

    private long accessTokenExpiration;

    private long refreshTokenExpiration;

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public void setAccessTokenExpiration(long accessTokenExpiration) {
        this.accessTokenExpiration = accessTokenExpiration;
    }

    public void setRefreshTokenExpiration(long refreshTokenExpiration) {
        this.refreshTokenExpiration = refreshTokenExpiration;
    }
}