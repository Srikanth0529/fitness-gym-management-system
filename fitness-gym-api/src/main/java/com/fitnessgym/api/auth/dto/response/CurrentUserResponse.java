package com.fitnessgym.api.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CurrentUserResponse {

    private Long userId;

    private String email;

    private String role;

    private String accountStatus;
}