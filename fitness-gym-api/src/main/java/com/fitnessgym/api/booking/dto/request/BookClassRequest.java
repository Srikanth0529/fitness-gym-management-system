package com.fitnessgym.api.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookClassRequest {

    @NotNull(message = "Occurrence ID is required")
    private Long occurrenceId;
}