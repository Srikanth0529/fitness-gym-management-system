package com.fitnessgym.api.classmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateClassRequest {

    @NotBlank(message = "Class name is required")
    @Size(max = 150, message = "Class name must not exceed 150 characters")
    private String className;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Trainer ID is required")
    private Long trainerId;

    @NotNull(message = "Default capacity is required")
    @Positive(message = "Default capacity must be positive")
    private Integer defaultCapacity;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;
}