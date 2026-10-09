package com.fitnessgym.api.user.controller;

import com.fitnessgym.api.common.response.ApiResponse;
import com.fitnessgym.api.user.dto.request.UpdateUserRequest;
import com.fitnessgym.api.user.dto.response.UserResponse;
import com.fitnessgym.api.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(
            @PathVariable Long userId,
            Authentication authentication
    ) {

        Long authenticatedUserId =
                Long.valueOf(authentication.getName());

        if (!authenticatedUserId.equals(userId)) {
            throw new RuntimeException(
                    "You are not authorized to access this user profile"
            );
        }

        UserResponse response =
                userService.getMyProfile(
                        authenticatedUserId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Admin profile retrieved successfully",
                        response
                )
        );
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {

        Long authenticatedUserId =
                Long.valueOf(authentication.getName());

        UserResponse response =
                userService.updateMyProfile(
                        authenticatedUserId,
                        userId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Admin profile updated successfully",
                        response
                )
        );
    }
}