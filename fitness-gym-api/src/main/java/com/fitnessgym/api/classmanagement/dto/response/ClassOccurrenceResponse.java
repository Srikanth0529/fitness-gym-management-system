package com.fitnessgym.api.classmanagement.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassOccurrenceResponse {

    private Long occurrenceId;

    private Long classId;

    private String className;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer capacity;

    private Integer currentBookings;

    private String occurrenceStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}