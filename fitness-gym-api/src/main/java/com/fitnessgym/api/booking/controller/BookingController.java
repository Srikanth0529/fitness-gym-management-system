package com.fitnessgym.api.booking.controller;

import com.fitnessgym.api.booking.dto.request.BookClassRequest;
import com.fitnessgym.api.booking.dto.response.BookingResponse;
import com.fitnessgym.api.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping(
            "/{memberId}/class-occurrences/{occurrenceId}/bookings"
    )
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse bookClass(
            @PathVariable Long memberId,
            @PathVariable Long occurrenceId
    ) {

        BookClassRequest request = BookClassRequest.builder()
                .occurrenceId(occurrenceId)
                .build();

        return bookingService.bookClass(
                memberId,
                request
        );
    }

        @PostMapping(
                "/{memberId}/class-bookings/{bookingId}/cancel"
        )
        @ResponseStatus(HttpStatus.OK)
        @PreAuthorize("hasRole('MEMBER')")
        public BookingResponse cancelBooking(
                @PathVariable Long memberId,
                @PathVariable Long bookingId
        ) {

        return bookingService.cancelBooking(
                memberId,
                bookingId
        );
        }
}