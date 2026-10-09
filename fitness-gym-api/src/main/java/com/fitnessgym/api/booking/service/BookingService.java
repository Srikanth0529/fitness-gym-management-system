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
import com.fitnessgym.api.trainer.entity.Trainer;
import com.fitnessgym.api.trainer.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ClassBookingRepository
            classBookingRepository;

    private final ClassOccurrenceRepository
            classOccurrenceRepository;

    private final MemberRepository memberRepository;

    private final TrainerRepository trainerRepository;

    private final BookingMapper bookingMapper;


    // =========================================================
    // BOOK CLASS
    // =========================================================

    @Transactional
    public BookingResponse bookClass(
            Long memberId,
            BookClassRequest request,
            Authentication authentication
    ) {

        validateMemberAccess(
                memberId,
                authentication
        );

        Member member =
                memberRepository.findById(
                        memberId
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: "
                                        + memberId
                        )
                );

        ClassOccurrence occurrence =
                classOccurrenceRepository.findById(
                        request.getOccurrenceId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class occurrence not found with id: "
                                        + request.getOccurrenceId()
                        )
                );


        // -----------------------------------------------------
        // Class must be active
        // -----------------------------------------------------

        if (occurrence.getGymClass()
                .getClassStatus() == null
                ||
                !"ACTIVE".equalsIgnoreCase(
                        occurrence
                                .getGymClass()
                                .getClassStatus()
                                .name()
                )) {

            throw new BusinessException(
                    "Class is not available for booking"
            );
        }


        // -----------------------------------------------------
        // Duplicate confirmed booking
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // Occurrence status
        // -----------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(
                occurrence.getOccurrenceStatus()
        )) {

            throw new BusinessException(
                    "Class occurrence is not available for booking"
            );
        }


        // -----------------------------------------------------
        // Capacity
        // -----------------------------------------------------

        if (occurrence.getCurrentBookings()
                >= occurrence.getCapacity()) {

            throw new BusinessException(
                    "Class is already full"
            );
        }


        // -----------------------------------------------------
        // Create booking
        // -----------------------------------------------------

        ClassBooking booking =
                ClassBooking.builder()
                        .member(member)
                        .occurrence(occurrence)
                        .bookingStatus("CONFIRMED")
                        .bookedAt(
                                LocalDateTime.now()
                        )
                        .build();

        occurrence.setCurrentBookings(
                occurrence.getCurrentBookings() + 1
        );

        ClassBooking savedBooking =
                classBookingRepository.save(
                        booking
                );

        return bookingMapper.toResponse(
                savedBooking
        );
    }


    // =========================================================
    // GET BOOKINGS
    //
    // ADMIN   -> ALL BOOKINGS
    // TRAINER -> BOOKINGS FOR OWN CLASSES
    // MEMBER  -> OWN BOOKINGS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookings(
            Authentication authentication
    ) {

        String role = getRole(authentication);

        List<ClassBooking> bookings;

        if ("ADMIN".equals(role)) {

            bookings =
                    classBookingRepository
                            .findAllByOrderByBookedAtDesc();

        } else if ("TRAINER".equals(role)) {

            Long userId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Trainer trainer =
                    trainerRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Trainer profile not found"
                                    )
                            );

            bookings =
                    classBookingRepository
                            .findByOccurrence_GymClass_TrainerIdOrderByBookedAtDesc(
                                    trainer.getId()
                            );

        } else if ("MEMBER".equals(role)) {

            Long userId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Member member =
                    memberRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Member profile not found"
                                    )
                            );

            bookings =
                    classBookingRepository
                            .findByMember_IdOrderByBookedAtDesc(
                                    member.getId()
                            );

        } else {

            throw new BusinessException(
                    "Unsupported user role"
            );
        }

        return bookings.stream()
                .map(bookingMapper::toResponse)
                .toList();
    }


    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(
            Long bookingId,
            Authentication authentication
    ) {

        ClassBooking booking =
                classBookingRepository
                        .findByBookingId(
                                bookingId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with id: "
                                                + bookingId
                                )
                        );

        validateBookingAccess(
                booking,
                authentication
        );

        return bookingMapper.toResponse(
                booking
        );
    }


    // =========================================================
    // GET MEMBER BOOKINGS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BookingResponse> getMemberBookings(
            Long memberId,
            Authentication authentication
    ) {

        String role = getRole(authentication);

        if (!"ADMIN".equals(role)) {

            validateMemberAccess(
                    memberId,
                    authentication
            );
        }

        if (!memberRepository.existsById(memberId)) {

            throw new ResourceNotFoundException(
                    "Member not found with id: "
                            + memberId
            );
        }

        return classBookingRepository
                .findByMember_IdOrderByBookedAtDesc(
                        memberId
                )
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }


    // =========================================================
    // GET TRAINER BOOKINGS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BookingResponse> getTrainerBookings(
            Long trainerId,
            Authentication authentication
    ) {

        String role = getRole(authentication);

        if (!"ADMIN".equals(role)) {

            validateTrainerAccess(
                    trainerId,
                    authentication
            );
        }

        if (!trainerRepository.existsById(trainerId)) {

            throw new ResourceNotFoundException(
                    "Trainer not found with id: "
                            + trainerId
            );
        }

        return classBookingRepository
                .findByOccurrence_GymClass_TrainerIdOrderByBookedAtDesc(
                        trainerId
                )
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }


    // =========================================================
    // CANCEL BOOKING - EXISTING MEMBER ENDPOINT
    // =========================================================

    @Transactional
    public BookingResponse cancelBooking(
            Long memberId,
            Long bookingId,
            Authentication authentication
    ) {

        validateMemberAccess(
                memberId,
                authentication
        );

        ClassBooking booking =
                classBookingRepository
                        .findByBookingId(
                                bookingId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with id: "
                                                + bookingId
                                )
                        );

        if (!booking.getMember()
                .getId()
                .equals(memberId)) {

            throw new BusinessException(
                    "Member is not authorized to cancel this booking"
            );
        }

        return cancelBookingInternal(
                booking,
                authentication
        );
    }


    // =========================================================
    // CANCEL BOOKING - SHARED ADMIN / TRAINER / MEMBER
    //
    // MEMBER  -> own booking
    // TRAINER -> booking for own class
    // ADMIN   -> any booking
    // =========================================================

    @Transactional
    public BookingResponse cancelBooking(
            Long bookingId,
            Authentication authentication
    ) {

        ClassBooking booking =
                classBookingRepository
                        .findByBookingId(
                                bookingId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with id: "
                                                + bookingId
                                )
                        );

        String role = getRole(authentication);

        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if ("ADMIN".equals(role)) {

            return cancelBookingInternal(
                    booking,
                    authentication
            );
        }


        // -----------------------------------------------------
        // MEMBER
        // -----------------------------------------------------

        if ("MEMBER".equals(role)) {

            Long userId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Member member =
                    memberRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Member profile not found"
                                    )
                            );

            if (!booking.getMember()
                    .getId()
                    .equals(member.getId())) {

                throw new BusinessException(
                        "Member is not authorized to cancel this booking"
                );
            }

            return cancelBookingInternal(
                    booking,
                    authentication
            );
        }


        // -----------------------------------------------------
        // TRAINER
        // -----------------------------------------------------

        if ("TRAINER".equals(role)) {

            Long userId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Trainer trainer =
                    trainerRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Trainer profile not found"
                                    )
                            );

            Long bookingTrainerId =
                    booking.getOccurrence()
                            .getGymClass()
                            .getTrainerId();

            if (!trainer.getId()
                    .equals(bookingTrainerId)) {

                throw new BusinessException(
                        "Trainer is not authorized to cancel this booking"
                );
            }

            return cancelBookingInternal(
                    booking,
                    authentication
            );
        }


        throw new BusinessException(
                "Unsupported user role"
        );
    }


    // =========================================================
    // INTERNAL CANCEL BOOKING
    // =========================================================

    private BookingResponse cancelBookingInternal(
            ClassBooking booking,
            Authentication authentication
    ) {

        if (!"CONFIRMED".equalsIgnoreCase(
                booking.getBookingStatus()
        )) {

            throw new BusinessException(
                    "Only confirmed bookings can be cancelled"
            );
        }

        LocalDateTime currentTime =
                LocalDateTime.now();

        String role = getRole(authentication);


        // -----------------------------------------------------
        // MEMBER CANCELLATION RULE
        //
        // Member must cancel at least 2 hours before class.
        //
        // Admin/Trainer have management authority and can cancel
        // a booking when required.
        // -----------------------------------------------------

        if ("MEMBER".equals(role)) {

            LocalDateTime cancellationDeadline =
                    booking.getOccurrence()
                            .getStartTime()
                            .minusHours(2);

            if (currentTime.isAfter(
                    cancellationDeadline
            )) {

                throw new BusinessException(
                        "Booking cannot be cancelled within 2 hours of the class"
                );
            }
        }


        // -----------------------------------------------------
        // UPDATE BOOKING
        // -----------------------------------------------------

        booking.setBookingStatus(
                "CANCELLED"
        );

        booking.setCancelledAt(
                currentTime
        );


        // -----------------------------------------------------
        // UPDATE OCCURRENCE CAPACITY
        // -----------------------------------------------------

        ClassOccurrence occurrence =
                booking.getOccurrence();

        if (occurrence.getCurrentBookings()
                > 0) {

            occurrence.setCurrentBookings(
                    occurrence.getCurrentBookings() - 1
            );
        }

        classOccurrenceRepository.save(
                occurrence
        );


        // -----------------------------------------------------
        // SAVE BOOKING
        // -----------------------------------------------------

        ClassBooking savedBooking =
                classBookingRepository.save(
                        booking
                );

        return bookingMapper.toResponse(
                savedBooking
        );
    }


    // =========================================================
    // CANCEL BOOKINGS WHEN OCCURRENCE IS CANCELLED
    // =========================================================

    @Transactional
    public void cancelBookingsForOccurrence(
            ClassOccurrence occurrence
    ) {

        List<ClassBooking> bookings =
                classBookingRepository
                        .findByOccurrence_OccurrenceId(
                                occurrence.getOccurrenceId()
                        );

        LocalDateTime now =
                LocalDateTime.now();

        for (ClassBooking booking :
                bookings) {

            if ("CONFIRMED".equalsIgnoreCase(
                    booking.getBookingStatus()
            )) {

                booking.setBookingStatus(
                        "CANCELLED"
                );

                booking.setCancelledAt(
                        now
                );
            }
        }

        occurrence.setCurrentBookings(0);

        classBookingRepository.saveAll(
                bookings
        );
    }


    // =========================================================
    // MEMBER ACCESS
    // =========================================================

    private void validateMemberAccess(
            Long memberId,
            Authentication authentication
    ) {

        String role = getRole(authentication);

        if ("ADMIN".equals(role)) {
            return;
        }

        if (!"MEMBER".equals(role)) {

            throw new BusinessException(
                    "Only the member or admin can access these bookings"
            );
        }

        Long userId =
                getAuthenticatedUserId(
                        authentication
                );

        Member member =
                memberRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Member profile not found"
                                )
                        );

        if (!member.getId().equals(memberId)) {

            throw new BusinessException(
                    "Member is not authorized to access these bookings"
            );
        }
    }


    // =========================================================
    // TRAINER ACCESS
    // =========================================================

    private void validateTrainerAccess(
            Long trainerId,
            Authentication authentication
    ) {

        String role = getRole(authentication);

        if ("ADMIN".equals(role)) {
            return;
        }

        if (!"TRAINER".equals(role)) {

            throw new BusinessException(
                    "Only the trainer or admin can access these bookings"
            );
        }

        Long userId =
                getAuthenticatedUserId(
                        authentication
                );

        Trainer trainer =
                trainerRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Trainer profile not found"
                                )
                        );

        if (!trainer.getId().equals(trainerId)) {

            throw new BusinessException(
                    "Trainer is not authorized to access these bookings"
            );
        }
    }


    // =========================================================
    // BOOKING ACCESS
    // =========================================================

    private void validateBookingAccess(
            ClassBooking booking,
            Authentication authentication
    ) {

        String role = getRole(authentication);

        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if ("ADMIN".equals(role)) {
            return;
        }

        Long userId =
                getAuthenticatedUserId(
                        authentication
                );


        // -----------------------------------------------------
        // MEMBER
        // -----------------------------------------------------

        if ("MEMBER".equals(role)) {

            Member member =
                    memberRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Member profile not found"
                                    )
                            );

            if (!booking.getMember()
                    .getId()
                    .equals(member.getId())) {

                throw new BusinessException(
                        "Member is not authorized to access this booking"
                );
            }

            return;
        }


        // -----------------------------------------------------
        // TRAINER
        // -----------------------------------------------------

        if ("TRAINER".equals(role)) {

            Trainer trainer =
                    trainerRepository
                            .findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Trainer profile not found"
                                    )
                            );

            Long bookingTrainerId =
                    booking.getOccurrence()
                            .getGymClass()
                            .getTrainerId();

            if (!trainer.getId()
                    .equals(bookingTrainerId)) {

                throw new BusinessException(
                        "Trainer is not authorized to access this booking"
                );
            }

            return;
        }


        throw new BusinessException(
                "Unsupported user role"
        );
    }


    // =========================================================
    // AUTHENTICATED USER ID
    // =========================================================

    private Long getAuthenticatedUserId(
            Authentication authentication
    ) {

        if (authentication == null
                || authentication.getName() == null) {

            throw new BusinessException(
                    "User authentication is required"
            );
        }

        try {

            return Long.valueOf(
                    authentication.getName()
            );

        } catch (NumberFormatException exception) {

            throw new BusinessException(
                    "Invalid authenticated user"
            );
        }
    }


    // =========================================================
    // ROLE
    // =========================================================

    private String getRole(
            Authentication authentication
    ) {

        if (authentication == null) {

            throw new BusinessException(
                    "User authentication is required"
            );
        }

        return authentication
                .getAuthorities()
                .stream()
                .map(authority ->
                        authority.getAuthority()
                )
                .filter(authority ->
                        authority.startsWith("ROLE_")
                )
                .map(authority ->
                        authority.substring(5)
                )
                .findFirst()
                .orElseThrow(() ->
                        new BusinessException(
                                "User role not found"
                        )
                );
    }
}