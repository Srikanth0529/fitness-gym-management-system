package com.fitnessgym.api.user.mapper;

import com.fitnessgym.api.user.dto.response.UserResponse;
import com.fitnessgym.api.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role.id", source = "role.id")
    @Mapping(
            target = "role.roleName",
            source = "role.roleName"
    )
    @Mapping(
            target = "role.description",
            source = "role.description"
    )
    @Mapping(
            target = "accountStatus",
            source = "accountStatus"
    )
    UserResponse toResponse(User user);
}