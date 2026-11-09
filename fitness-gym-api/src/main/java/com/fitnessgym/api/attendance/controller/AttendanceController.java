
package com.fitnessgym.api.attendance.controller;

import com.fitnessgym.api.attendance.dto.request.CheckInRequest;
import com.fitnessgym.api.attendance.dto.response.AttendanceResponse;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceType;
import com.fitnessgym.api.attendance.service.AttendanceService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
@Validated
public class AttendanceController {

    private final AttendanceService attendanceService;


    // ==================================================
    // MEMBER ATTENDANCE
    // ==================================================

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<AttendanceResponse> memberCheckIn(
            Authentication authentication,
            @Valid @RequestBody(required = false) CheckInRequest request
    ) {

        String remarks = request != null
                ? request.getRemarks()
                : null;

        AttendanceResponse response =
                attendanceService.memberCheckIn(
                        getUserId(authentication),
                        remarks
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @PostMapping("/check-out")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<AttendanceResponse> memberCheckOut(
            Authentication authentication
    ) {

        AttendanceResponse response =
                attendanceService.memberCheckOut(
                        getUserId(authentication)
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/my-history")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendanceHistory(
            Authentication authentication,

            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        List<AttendanceResponse> response =
                attendanceService.getMemberAttendanceHistory(
                        getUserId(authentication),
                        startDate,
                        endDate
                );

        return ResponseEntity.ok(response);
    }


    // ==================================================
    // TRAINER WORKING-HOURS ATTENDANCE
    // ==================================================

    @PostMapping("/trainer/check-in")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AttendanceResponse> trainerCheckIn(
            Authentication authentication
    ) {

        AttendanceResponse response =
                attendanceService.trainerCheckIn(
                        getUserId(authentication)
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @PostMapping("/trainer/check-out")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AttendanceResponse> trainerCheckOut(
            Authentication authentication
    ) {

        AttendanceResponse response =
                attendanceService.trainerCheckOut(
                        getUserId(authentication)
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/trainer/my-history")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<AttendanceResponse>> getTrainerAttendanceHistory(
            Authentication authentication,

            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        List<AttendanceResponse> response =
                attendanceService.getTrainerAttendanceHistory(
                        getUserId(authentication),
                        startDate,
                        endDate
                );

        return ResponseEntity.ok(response);
    }


    // ==================================================
    // TRAINER MARKS MEMBER ATTENDANCE
    // ==================================================

    @PostMapping("/members/{memberId}/trainer-check-in")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AttendanceResponse> trainerMarkMemberAttendance(
            Authentication authentication,

            @PathVariable
            Long memberId,

            @Valid
            @RequestBody(required = false)
            CheckInRequest request
    ) {

        String remarks = request != null
                ? request.getRemarks()
                : null;

        AttendanceResponse response =
                attendanceService.trainerMarkMemberAttendance(
                        getUserId(authentication),
                        memberId,
                        remarks
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==================================================
    // ADMIN ATTENDANCE MANAGEMENT
    // ==================================================

    @GetMapping("/admin/by-date")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByDate(
            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,

            @RequestParam
            AttendanceType type
    ) {

        List<AttendanceResponse> response =
                attendanceService.getAttendanceByDate(
                        date,
                        type
                );

        return ResponseEntity.ok(response);
    }


    // ==================================================
    // AUTHENTICATED USER ID
    // ==================================================

    private Long getUserId(Authentication authentication) {

        if (authentication == null
                || authentication.getName() == null) {

            throw new IllegalStateException(
                    "Authenticated user information is unavailable."
            );
        }

        return Long.valueOf(authentication.getName());
    }
}
