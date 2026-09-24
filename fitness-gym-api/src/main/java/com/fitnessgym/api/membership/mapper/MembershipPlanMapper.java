package com.fitnessgym.api.membership.mapper;

import com.fitnessgym.api.membership.dto.response.MembershipPlanResponse;
import com.fitnessgym.api.membership.entity.MembershipPlan;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MembershipPlanMapper {

    MembershipPlanResponse toResponse(MembershipPlan membershipPlan);
}