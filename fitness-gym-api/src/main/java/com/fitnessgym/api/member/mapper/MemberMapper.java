package com.fitnessgym.api.member.mapper;

import com.fitnessgym.api.member.dto.response.MemberResponse;
import com.fitnessgym.api.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    @Mapping(
            target = "userId",
            source = "user.id"
    )
    @Mapping(
            target = "email",
            source = "user.email"
    )
    @Mapping(
            target = "approvalStatus",
            expression = "java(member.getApprovalStatus().name())"
    )
    MemberResponse toResponse(Member member);
}