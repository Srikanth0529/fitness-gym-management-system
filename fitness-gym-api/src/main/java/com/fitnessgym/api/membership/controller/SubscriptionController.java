package com.fitnessgym.api.membership.controller;

import com.fitnessgym.api.common.response.ApiResponse;
import com.fitnessgym.api.membership.dto.request.CreateSubscriptionRequest;
import com.fitnessgym.api.membership.dto.response.SubscriptionResponse;
import com.fitnessgym.api.membership.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscriptions")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
            @Valid @RequestBody CreateSubscriptionRequest request,
            Authentication authentication
    ) {

        Long userId = Long.valueOf(authentication.getName());

        SubscriptionResponse response =
                subscriptionService.createSubscription(
                        userId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Membership subscribed successfully",
                                response
                        )
                );
    }

    @GetMapping("/me/subscription")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getCurrentSubscription(
            Authentication authentication
    ) {

        Long userId = Long.valueOf(authentication.getName());

        SubscriptionResponse response =
                subscriptionService.getCurrentSubscription(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Current membership retrieved successfully",
                        response
                )
        );
    }
}