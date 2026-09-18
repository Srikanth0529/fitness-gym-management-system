package com.fitnessgym.api.member.controller;

import com.fitnessgym.api.common.response.ApiResponse;
import com.fitnessgym.api.member.dto.request.MemberApprovalRequest;
import com.fitnessgym.api.member.dto.request.UpdateMemberRequest;
import com.fitnessgym.api.member.dto.response.MemberResponse;
import com.fitnessgym.api.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/{memberId}")
    public ResponseEntity<ApiResponse<MemberResponse>> getMyProfile(
            @PathVariable Long memberId,
            Authentication authentication
    ) {

        Long userId = Long.valueOf(authentication.getName());

        MemberResponse response =
                memberService.getMyProfile(
                        userId,
                        memberId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member profile retrieved successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/{memberId}")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMyProfile(
            @PathVariable Long memberId,
            @Valid @RequestBody UpdateMemberRequest request,
            Authentication authentication
    ) {

        Long userId = Long.valueOf(authentication.getName());

        MemberResponse response =
                memberService.updateMyProfile(
                        userId,
                        memberId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member profile updated successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{memberId}/approval")
    public ResponseEntity<ApiResponse<MemberResponse>> updateApprovalStatus(
            @PathVariable Long memberId,
            @Valid @RequestBody MemberApprovalRequest request
    ) {

        MemberResponse response =
                memberService.updateApprovalStatus(
                        memberId,
                        request.getApprovalStatus()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member approval status updated successfully",
                        response
                )
        );
    }
}