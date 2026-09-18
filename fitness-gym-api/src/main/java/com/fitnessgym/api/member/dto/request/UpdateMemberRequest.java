package com.fitnessgym.api.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateMemberRequest {

    @NotBlank(message = "First name is required")
    @Size(
            max = 100,
            message = "First name cannot exceed 100 characters"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(
            max = 100,
            message = "Last name cannot exceed 100 characters"
    )
    private String lastName;

    @Size(
            max = 20,
            message = "Phone cannot exceed 20 characters"
    )
    private String phone;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(
            max = 20,
            message = "Gender cannot exceed 20 characters"
    )
    private String gender;

    @Size(
            max = 500,
            message = "Address cannot exceed 500 characters"
    )
    private String address;
}