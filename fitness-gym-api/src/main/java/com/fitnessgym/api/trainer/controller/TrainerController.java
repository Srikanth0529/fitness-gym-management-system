package com.fitnessgym.api.trainer.controller;

import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.common.response.ApiResponse;
import com.fitnessgym.api.trainer.dto.request.TrainerRegistrationRequest;
import com.fitnessgym.api.trainer.dto.request.UpdateTrainerRequest;
import com.fitnessgym.api.trainer.dto.response.TrainerResponse;
import com.fitnessgym.api.trainer.service.TrainerService;
import com.fitnessgym.api.user.dto.request.UpdateUserStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;


    // =========================================================
    // TRAINER REGISTRATION
    // =========================================================

    @PostMapping
    public ResponseEntity<ApiResponse<TrainerResponse>> register(
            @Valid @RequestBody TrainerRegistrationRequest request
    ) {

        TrainerResponse response =
                trainerService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Trainer registration submitted successfully",
                                response
                        )
                );
    }


    // =========================================================
    // GET ALL TRAINERS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TrainerResponse>>> getAllTrainers() {

        List<TrainerResponse> response =
                trainerService.getAllTrainers();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainers retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET TRAINER
    //
    // TRAINER -> Own profile
    // ADMIN   -> Any trainer
    // =========================================================

    @GetMapping("/{trainerId}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TrainerResponse>> getTrainer(
            @PathVariable Long trainerId,
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

        TrainerResponse response =
                trainerService.getTrainerById(
                        userId,
                        trainerId,
                        admin
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainer retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE TRAINER
    //
    // TRAINER -> Own profile
    // ADMIN   -> Any trainer
    // =========================================================

    @PutMapping("/{trainerId}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateTrainer(
            @PathVariable Long trainerId,
            @Valid @RequestBody UpdateTrainerRequest request,
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

        TrainerResponse response =
                trainerService.updateTrainer(
                        userId,
                        trainerId,
                        admin,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainer updated successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE TRAINER APPROVAL
    // ADMIN ONLY
    // =========================================================

    @PatchMapping("/{trainerId}/approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateApprovalStatus(
            @PathVariable Long trainerId,
            @RequestParam ApprovalStatus approvalStatus
    ) {

        TrainerResponse response =
                trainerService.updateApprovalStatus(
                        trainerId,
                        approvalStatus
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainer approval status updated successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE TRAINER ACCOUNT STATUS
    // ADMIN ONLY
    // =========================================================

    @PatchMapping("/{trainerId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateAccountStatus(
            @PathVariable Long trainerId,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {

        TrainerResponse response =
                trainerService.updateAccountStatus(
                        trainerId,
                        request.getStatus()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainer account status updated successfully",
                        response
                )
        );
    }
}