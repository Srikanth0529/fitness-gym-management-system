package com.fitnessgym.api.trainer.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerResponse {

    private Long id;

    private Long userId;

    private String email;

    private String firstName;

    private String lastName;

    private String phone;

    private String specialization;

    private Integer experienceYears;

    private String bio;

    private String approvalStatus;

    private String accountStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}