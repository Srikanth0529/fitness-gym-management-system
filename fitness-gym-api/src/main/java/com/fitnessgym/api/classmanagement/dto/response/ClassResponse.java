package com.fitnessgym.api.classmanagement.dto.response;

import com.fitnessgym.api.common.enums.ClassStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassResponse {

    private Long classId;

    private String className;

    private String description;

    private Long trainerId;

    private Integer defaultCapacity;

    private String location;

    private ClassStatus classStatus;
}