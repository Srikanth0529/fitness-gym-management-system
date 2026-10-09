package com.fitnessgym.api.user.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private RoleResponse role;

    private String accountStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}