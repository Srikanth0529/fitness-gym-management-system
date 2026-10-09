package com.fitnessgym.api.member.controller;

import com.fitnessgym.api.common.response.ApiResponse;
import com.fitnessgym.api.member.dto.request.MemberApprovalRequest;
import com.fitnessgym.api.member.dto.request.UpdateMemberRequest;
import com.fitnessgym.api.member.dto.response.MemberResponse;
import com.fitnessgym.api.member.service.MemberService;
import com.fitnessgym.api.user.dto.request.UpdateUserStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;


    // =========================================================
    // GET ALL MEMBERS
    // ADMIN ONLY
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getAllMembers() {

        List<MemberResponse> response =
                memberService.getAllMembers();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Members retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET MEMBER PROFILE
    //
    // MEMBER -> Own profile
    // ADMIN  -> Any member
    // =========================================================

    @PreAuthorize("hasAnyRole('MEMBER', 'ADMIN')")
    @GetMapping("/{memberId}")
    public ResponseEntity<ApiResponse<MemberResponse>> getProfile(
            @PathVariable Long memberId,
            Authentication authentication
    ) {

        Long userId =
                Long.valueOf(authentication.getName());

        boolean admin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                        );

        MemberResponse response =
                memberService.getProfile(
                        userId,
                        memberId,
                        admin
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member profile retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE MEMBER PROFILE
    //
    // MEMBER -> Own profile
    // ADMIN  -> Any member
    // =========================================================

    @PreAuthorize("hasAnyRole('MEMBER', 'ADMIN')")
    @PutMapping("/{memberId}")
    public ResponseEntity<ApiResponse<MemberResponse>> updateProfile(
            @PathVariable Long memberId,
            @Valid @RequestBody UpdateMemberRequest request,
            Authentication authentication
    ) {

        Long userId =
                Long.valueOf(authentication.getName());

        boolean admin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                        );

        MemberResponse response =
                memberService.updateProfile(
                        userId,
                        memberId,
                        admin,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member profile updated successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE MEMBER APPROVAL
    // ADMIN ONLY
    // =========================================================

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


    // =========================================================
    // UPDATE MEMBER ACCOUNT STATUS
    // ADMIN ONLY
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{memberId}/status")
    public ResponseEntity<ApiResponse<MemberResponse>> updateAccountStatus(
            @PathVariable Long memberId,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {

        MemberResponse response =
                memberService.updateAccountStatus(
                        memberId,
                        request.getStatus()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member account status updated successfully",
                        response
                )
        );
    }
}