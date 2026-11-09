
package com.fitnessgym.api.attendance.mapper;

import com.fitnessgym.api.attendance.dto.response.AttendanceResponse;
import com.fitnessgym.api.attendance.entity.Attendance;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {

    @Mapping(target = "memberId", ignore = true)
    @Mapping(target = "trainerId", ignore = true)
    AttendanceResponse toResponse(Attendance attendance);
}
