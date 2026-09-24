package com.fitnessgym.api.membership.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MEMBERSHIP_PLAN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlan {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "membership_plan_seq"
    )
    @SequenceGenerator(
            name = "membership_plan_seq",
            sequenceName = "MEMBERSHIP_PLAN_SEQ",
            allocationSize = 1
    )
    @Column(name = "PLAN_ID")
    private Long planId;

    @Column(name = "PLAN_NAME", nullable = false, unique = true)
    private String planName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "DURATION_DAYS", nullable = false)
    private Integer durationDays;

    @Column(name = "PLAN_STATUS", nullable = false)
    private String planStatus;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;
}