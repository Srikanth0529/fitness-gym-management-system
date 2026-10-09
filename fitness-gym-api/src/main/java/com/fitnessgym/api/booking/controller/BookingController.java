package com.fitnessgym.api.booking.controller;

import com.fitnessgym.api.booking.dto.request.BookClassRequest;
import com.fitnessgym.api.booking.dto.response.BookingResponse;
import com.fitnessgym.api.booking.service.BookingService;
import com.fitnessgym.api.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;


    // =========================================================
    // BOOK CLASS
    // =========================================================

    @PostMapping(
            "/members/{memberId}/class-occurrences/{occurrenceId}/bookings"
    )
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<BookingResponse>> bookClass(
            @PathVariable Long memberId,
            @PathVariable Long occurrenceId,
            Authentication authentication
    ) {

        BookClassRequest request =
                BookClassRequest.builder()
                        .occurrenceId(occurrenceId)
                        .build();

        BookingResponse response =
                bookingService.bookClass(
                        memberId,
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Class booked successfully",
                                response
                        )
                );
    }


    // =========================================================
    // GET ALL / CURRENT USER BOOKINGS
    // =========================================================

    @GetMapping("/class-bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookings(
            Authentication authentication
    ) {

        List<BookingResponse> response =
                bookingService.getBookings(authentication);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class bookings retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    @GetMapping("/class-bookings/{bookingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {

        BookingResponse response =
                bookingService.getBookingById(
                        bookingId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class booking retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET MEMBER BOOKINGS
    // =========================================================

    @GetMapping("/members/{memberId}/class-bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMemberBookings(
            @PathVariable Long memberId,
            Authentication authentication
    ) {

        List<BookingResponse> response =
                bookingService.getMemberBookings(
                        memberId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Member class bookings retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // GET TRAINER BOOKINGS
    // =========================================================

    @GetMapping("/trainers/{trainerId}/class-bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getTrainerBookings(
            @PathVariable Long trainerId,
            Authentication authentication
    ) {

        List<BookingResponse> response =
                bookingService.getTrainerBookings(
                        trainerId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Trainer class bookings retrieved successfully",
                        response
                )
        );
    }


    // =========================================================
    // CANCEL BOOKING - SHARED
    //
    // MEMBER  -> own booking
    // TRAINER -> booking for own class
    // ADMIN   -> any booking
    // =========================================================

    @PostMapping("/class-bookings/{bookingId}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {

        BookingResponse response =
                bookingService.cancelBooking(
                        bookingId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class booking cancelled successfully",
                        response
                )
        );
    }


    // =========================================================
    // CANCEL MEMBER BOOKING - EXISTING ENDPOINT
    //
    // Kept for existing frontend compatibility.
    // =========================================================

    @PostMapping(
            "/members/{memberId}/class-bookings/{bookingId}/cancel"
    )
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelMemberBooking(
            @PathVariable Long memberId,
            @PathVariable Long bookingId,
            Authentication authentication
    ) {

        BookingResponse response =
                bookingService.cancelBooking(
                        memberId,
                        bookingId,
                        authentication
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Class booking cancelled successfully",
                        response
                )
        );
    }
}