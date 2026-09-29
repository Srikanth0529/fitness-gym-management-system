package com.fitnessgym.api.booking.service;

import com.fitnessgym.api.booking.dto.request.BookClassRequest;
import com.fitnessgym.api.booking.dto.response.BookingResponse;
import com.fitnessgym.api.booking.entity.ClassBooking;
import com.fitnessgym.api.booking.mapper.BookingMapper;
import com.fitnessgym.api.booking.repository.ClassBookingRepository;
import com.fitnessgym.api.classmanagement.entity.ClassOccurrence;
import com.fitnessgym.api.classmanagement.repository.ClassOccurrenceRepository;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ClassBookingRepository classBookingRepository;
    private final ClassOccurrenceRepository classOccurrenceRepository;
    private final MemberRepository memberRepository;
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponse bookClass(
            Long memberId,
            BookClassRequest request
    ) {

        // 1. Find member
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + memberId
                        )
                );

        // 2. Find class occurrence
        ClassOccurrence occurrence =
                classOccurrenceRepository.findById(
                        request.getOccurrenceId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class occurrence not found with id: "
                                        + request.getOccurrenceId()
                        )
                );

        // 3. Check duplicate booking
        boolean alreadyBooked =
                classBookingRepository
                        .countByMemberAndOccurrence(
                                memberId,
                                occurrence.getOccurrenceId()
                        ) > 0;

        if (alreadyBooked) {
            throw new BusinessException(
                    "Member has already booked this class occurrence"
            );
        }

        // 4. Check occurrence status
        if (!"ACTIVE".equalsIgnoreCase(
                occurrence.getOccurrenceStatus()
        )) {
            throw new BusinessException(
                    "Class occurrence is not available for booking"
            );
        }

        // 5. Check capacity
        if (occurrence.getCurrentBookings()
                >= occurrence.getCapacity()) {

            throw new BusinessException(
                    "Class is already full"
            );
        }

        // 6. Create booking
        ClassBooking booking = ClassBooking.builder()
                .member(member)
                .occurrence(occurrence)
                .bookingStatus("CONFIRMED")
                .bookedAt(LocalDateTime.now())
                .build();

        // 7. Increase current booking count
        occurrence.setCurrentBookings(
                occurrence.getCurrentBookings() + 1
        );

        // 8. Save booking
        ClassBooking savedBooking =
                classBookingRepository.save(booking);

        // 9. Return response
        return bookingMapper.toResponse(savedBooking);
    }

    @Transactional
        public BookingResponse cancelBooking(
                Long memberId,
                Long bookingId
        ) {

        // 1. Find booking
                ClassBooking booking =
                        classBookingRepository.findByBookingId(
                                bookingId
                        ).orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with id: "
                                                + bookingId
                                )
                        );

                // 2. Verify booking belongs to member
                if (!booking.getMember().getId().equals(memberId)) {
                        throw new BusinessException(
                                "Member is not authorized to cancel this booking"
                        );
                }

                // 3. Check booking status
                if (!"CONFIRMED".equalsIgnoreCase(
                        booking.getBookingStatus()
                )) {
                        throw new BusinessException(
                                "Only confirmed bookings can be cancelled"
                        );
                }

                // 4. Check cancellation deadline
                LocalDateTime currentTime = LocalDateTime.now();

                LocalDateTime cancellationDeadline =
                        booking.getOccurrence()
                                .getStartTime()
                                .minusHours(2);

                if (currentTime.isAfter(cancellationDeadline)) {
                        throw new BusinessException(
                                "Booking cannot be cancelled within 2 hours of the class"
                        );
                }

                // 5. Cancel booking
                booking.setBookingStatus("CANCELLED");
                booking.setCancelledAt(currentTime);

                // 6. Decrease current booking count
                ClassOccurrence occurrence =
                        booking.getOccurrence();

                if (occurrence.getCurrentBookings() > 0) {
                        occurrence.setCurrentBookings(
                                occurrence.getCurrentBookings() - 1
                        );
                }

                // 7. Save booking
                ClassBooking savedBooking =
                        classBookingRepository.save(booking);

                // 8. Return response
                return bookingMapper.toResponse(savedBooking);
                }
}