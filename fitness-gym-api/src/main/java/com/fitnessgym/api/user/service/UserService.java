package com.fitnessgym.api.user.service;

import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.user.dto.request.UpdateUserRequest;
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
    public UserResponse getMyProfile(Long authenticatedUserId) {

        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: "
                                        + authenticatedUserId
                        )
                );

        return userMapper.toResponse(user);
    }

    public UserResponse updateMyProfile(
            Long authenticatedUserId,
            Long requestedUserId,
            UpdateUserRequest request
    ) {

        if (!authenticatedUserId.equals(requestedUserId)) {
            throw new BusinessException(
                    "You are not authorized to update this user profile"
            );
        }

        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: "
                                        + authenticatedUserId
                        )
                );

        if (request.getEmail() != null
                && !request.getEmail().isBlank()
                && !user.getEmail().equalsIgnoreCase(
                        request.getEmail()
                )) {

            if (userRepository.countByEmail(
                    request.getEmail()
            ) > 0) {

                throw new BusinessException(
                        "Email is already registered"
                );
            }

            user.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
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

            throw new BusinessException(
                    "Email is already registered"
            );
        }
    }
}