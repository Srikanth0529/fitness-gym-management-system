package com.fitnessgym.api.classmanagement.controller;

import com.fitnessgym.api.classmanagement.dto.request.CreateClassRequest;
import com.fitnessgym.api.classmanagement.dto.request.UpdateClassRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassResponse;
import com.fitnessgym.api.common.enums.ClassStatus;
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
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;


    // =========================================================
    // CREATE CLASS
    // ADMIN + TRAINER
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassResponse>> createClass(
            @Valid @RequestBody CreateClassRequest request,
            Authentication authentication
    ) {

        ClassResponse response =
                classService.createClass(request, authentication);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class created successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET ALL CLASSES
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<ClassResponse>>> getClasses(
            @RequestParam(required = false) ClassStatus status,
            @RequestParam(required = false) Long trainerId,
            Authentication authentication
    ) {

        List<ClassResponse> response =
                classService.getClasses(
                        status,
                        trainerId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Classes retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET CLASS BY ID
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @GetMapping("/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<ClassResponse>> getClassById(
            @PathVariable Long classId,
            Authentication authentication
    ) {

        ClassResponse response =
                classService.getClassById(
                        classId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE CLASS
    // ADMIN + TRAINER
    // TRAINER CAN UPDATE ONLY OWN CLASS
    // =========================================================

    @PutMapping("/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassResponse>> updateClass(
            @PathVariable Long classId,
            @Valid @RequestBody UpdateClassRequest request,
            Authentication authentication
    ) {

        ClassResponse response =
                classService.updateClass(
                        classId,
                        request,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class updated successfully",
                        response
                )
        );
    }


    // =========================================================
    // UPDATE CLASS STATUS
    // ADMIN + TRAINER
    // TRAINER CAN MANAGE ONLY OWN CLASS
    // =========================================================

    @PatchMapping("/{classId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassResponse>> updateClassStatus(
            @PathVariable Long classId,
            @RequestParam ClassStatus status,
            Authentication authentication
    ) {

        ClassResponse response =
                classService.updateClassStatus(
                        classId,
                        status,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class status updated successfully",
                        response
                )
        );
    }
}