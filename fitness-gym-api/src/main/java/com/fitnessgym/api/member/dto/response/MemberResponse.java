package com.fitnessgym.api.member.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {

    private Long id;

    private Long userId;

    private String email;

    private String firstName;

    private String lastName;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String approvalStatus;

    private LocalDate joinDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}