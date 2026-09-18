package com.fitnessgym.api.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private Long memberId;

    private String email;

    private String role;

    private String tokenType;

    private String accessToken;

    private String refreshToken;
}