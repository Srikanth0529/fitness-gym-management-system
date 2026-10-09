
package com.fitnessgym.api.booking.mapper;

import com.fitnessgym.api.booking.dto.response.BookingResponse;
import com.fitnessgym.api.booking.entity.ClassBooking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(
            target = "memberId",
            source = "member.id"
    )
    @Mapping(
            target = "memberName",
            expression = "java(booking.getMember().getFirstName() + \" \" + booking.getMember().getLastName())"
    )
    @Mapping(
            target = "memberEmail",
            source = "member.user.email"
    )
    @Mapping(
            target = "memberPhone",
            source = "member.phone"
    )
    @Mapping(
            target = "occurrenceId",
            source = "occurrence.occurrenceId"
    )
    @Mapping(
            target = "classId",
            source = "occurrence.gymClass.classId"
    )
    @Mapping(
            target = "className",
            source = "occurrence.gymClass.className"
    )
    @Mapping(
            target = "startTime",
            source = "occurrence.startTime"
    )
    @Mapping(
            target = "endTime",
            source = "occurrence.endTime"
    )
    BookingResponse toResponse(
            ClassBooking booking
    );
}
