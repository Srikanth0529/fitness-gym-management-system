package com.fitnessgym.api.classmanagement.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateClassOccurrenceRequest {

    @Future(
            message = "Class start time must be in the future"
    )
    private LocalDateTime startTime;

    @Future(
            message = "Class end time must be in the future"
    )
    private LocalDateTime endTime;

    @Positive(
            message = "Capacity must be positive"
    )
    private Integer capacity;
}