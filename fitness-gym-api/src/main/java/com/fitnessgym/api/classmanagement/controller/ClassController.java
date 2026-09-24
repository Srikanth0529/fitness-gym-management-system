package com.fitnessgym.api.classmanagement.controller;

import com.fitnessgym.api.classmanagement.dto.request.CreateClassRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassResponse;
import com.fitnessgym.api.classmanagement.service.ClassService;
import com.fitnessgym.api.common.enums.ClassStatus;
import com.fitnessgym.api.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<ClassResponse>> createClass(
            @Valid @RequestBody CreateClassRequest request
    ) {

        ClassResponse response =
                classService.createClass(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Class created successfully",
                                response
                        )
                );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MEMBER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ClassResponse>>> getClasses(
            @RequestParam(required = false) ClassStatus status,
            @RequestParam(required = false) Long trainerId
    ) {

        List<ClassResponse> response =
                classService.getClasses(
                        status,
                        trainerId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Classes retrieved successfully",
                        response
                )
        );
    }
}