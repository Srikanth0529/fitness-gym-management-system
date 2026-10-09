package com.fitnessgym.api.trainer.mapper;

import com.fitnessgym.api.trainer.dto.response.TrainerResponse;
import com.fitnessgym.api.trainer.entity.Trainer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerMapper {

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
            expression = "java(trainer.getApprovalStatus().name())"
    )
    @Mapping(
            target = "accountStatus",
            expression = "java(trainer.getUser().getAccountStatus().name())"
    )
    TrainerResponse toResponse(Trainer trainer);
}