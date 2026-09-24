package com.fitnessgym.api.membership.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponse {

    private Long subscriptionId;

    private Long memberId;

    private Long planId;

    private String planName;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;
}