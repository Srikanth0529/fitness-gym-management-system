package com.fitnessgym.api.membership.controller;

import com.fitnessgym.api.membership.dto.response.MembershipPlanResponse;
import com.fitnessgym.api.membership.service.MembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/membership-plans")
@RequiredArgsConstructor
public class MembershipPlanController {

    private final MembershipPlanService membershipPlanService;

    @GetMapping
    public ResponseEntity<List<MembershipPlanResponse>> getActiveMembershipPlans() {

        return ResponseEntity.ok(
                membershipPlanService.getActiveMembershipPlans()
        );
    }

    @GetMapping("/{planId}")
    public ResponseEntity<MembershipPlanResponse> getMembershipPlanById(
            @PathVariable Long planId) {

        return ResponseEntity.ok(
                membershipPlanService.getMembershipPlanById(planId)
        );
    }
}