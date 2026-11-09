
package com.fitnessgym.api.attendance.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CheckInRequest {

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;
}
