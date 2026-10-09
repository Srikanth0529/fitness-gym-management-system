package com.fitnessgym.api.booking.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long bookingId;

    private Long memberId;

    private String memberName;

    private String memberEmail;

    private String memberPhone;

    private Long occurrenceId;

    private Long classId;

    private String className;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String bookingStatus;

    private LocalDateTime bookedAt;

    private LocalDateTime cancelledAt;
}