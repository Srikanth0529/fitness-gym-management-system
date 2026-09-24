package com.fitnessgym.api.membership.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlanResponse {

    private Long planId;
    private String planName;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private String planStatus;
}