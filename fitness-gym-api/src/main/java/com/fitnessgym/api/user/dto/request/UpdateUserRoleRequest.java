package com.fitnessgym.api.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRoleRequest {

    @NotBlank(message = "Role is required")
    private String role;
}