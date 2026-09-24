package com.fitnessgym.api.membership.mapper;

import com.fitnessgym.api.membership.dto.response.SubscriptionResponse;
import com.fitnessgym.api.membership.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    @Mapping(
            target = "memberId",
            source = "member.id"
    )
    @Mapping(
            target = "planId",
            source = "plan.planId"
    )
    @Mapping(
            target = "planName",
            source = "plan.planName"
    )
    SubscriptionResponse toResponse(Subscription subscription);
}