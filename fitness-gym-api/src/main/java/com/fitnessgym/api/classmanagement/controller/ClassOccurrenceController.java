package com.fitnessgym.api.classmanagement.controller;

import com.fitnessgym.api.classmanagement.dto.request.CreateClassOccurrenceRequest;
import com.fitnessgym.api.classmanagement.dto.request.UpdateClassOccurrenceRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassOccurrenceResponse;
import com.fitnessgym.api.classmanagement.service.ClassService;
import com.fitnessgym.api.common.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ClassOccurrenceController {

    private final ClassService classService;


    // =========================================================
    // GET OCCURRENCES FOR A CLASS
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @GetMapping("/classes/{classId}/occurrences")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<ClassOccurrenceResponse>>> getOccurrences(
            @PathVariable Long classId,
            Authentication authentication
    ) {

        List<ClassOccurrenceResponse> response =
                classService.getClassOccurrences(
                        classId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class occurrences retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // CREATE OCCURRENCE
    // ADMIN + TRAINER
    // TRAINER CAN CREATE ONLY FOR OWN CLASS
    // =========================================================

    @PostMapping("/classes/{classId}/occurrences")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassOccurrenceResponse>> createOccurrence(
            @PathVariable Long classId,
            @Valid @RequestBody CreateClassOccurrenceRequest request,
            Authentication authentication
    ) {

        ClassOccurrenceResponse response =
                classService.createOccurrence(
                        classId,
                        request,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class occurrence created successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET OCCURRENCE BY ID
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @GetMapping("/class-occurrences/{occurrenceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<ClassOccurrenceResponse>> getOccurrenceById(
            @PathVariable Long occurrenceId,
            Authentication authentication
    ) {

        ClassOccurrenceResponse response =
                classService.getOccurrenceById(
                        occurrenceId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class occurrence retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE OCCURRENCE
    // ADMIN + TRAINER
    // TRAINER CAN UPDATE ONLY OWN CLASS OCCURRENCE
    // =========================================================

    @PutMapping("/class-occurrences/{occurrenceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassOccurrenceResponse>> updateOccurrence(
            @PathVariable Long occurrenceId,
            @Valid @RequestBody UpdateClassOccurrenceRequest request,
            Authentication authentication
    ) {

        ClassOccurrenceResponse response =
                classService.updateOccurrence(
                        occurrenceId,
                        request,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class occurrence updated successfully",
                        response
                )
        );
    }


    // =========================================================
    // CANCEL OCCURRENCE
    // ADMIN + TRAINER
    // TRAINER CAN CANCEL ONLY OWN CLASS OCCURRENCE
    // =========================================================

    @PostMapping("/class-occurrences/{occurrenceId}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassOccurrenceResponse>> cancelOccurrence(
            @PathVariable Long occurrenceId,
            Authentication authentication
    ) {

        ClassOccurrenceResponse response =
                classService.cancelOccurrence(
                        occurrenceId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class occurrence cancelled successfully",
                        response
                )
        );
    }
}