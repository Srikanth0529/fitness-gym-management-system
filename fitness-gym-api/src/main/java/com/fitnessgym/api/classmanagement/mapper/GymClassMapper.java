package com.fitnessgym.api.classmanagement.mapper;

import com.fitnessgym.api.classmanagement.dto.request.CreateClassRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassResponse;
import com.fitnessgym.api.classmanagement.entity.GymClass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GymClassMapper {

    @Mapping(target = "classId", ignore = true)
    @Mapping(target = "classStatus", ignore = true)
    GymClass toEntity(CreateClassRequest request);

    ClassResponse toResponse(GymClass gymClass);
}