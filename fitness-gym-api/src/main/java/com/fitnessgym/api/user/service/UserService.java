package com.fitnessgym.api.user.service;

import com.fitnessgym.api.common.enums.AccountStatus;
import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.user.dto.response.UserResponse;
import com.fitnessgym.api.user.entity.Role;
import com.fitnessgym.api.user.entity.User;
import com.fitnessgym.api.user.mapper.UserMapper;
import com.fitnessgym.api.user.repository.RoleRepository;
import com.fitnessgym.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntityByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }

    public Role getRole(RoleName roleName) {

        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() ->
                        new BusinessException(
                                "Role not configured: " + roleName
                        )
                );
    }

    public void validateEmailNotExists(String email) {
    if (userRepository.countByEmail(email) > 0) {
        throw new BusinessException("Email is already registered");
    }
}
}
