package com.fitnessgym.api.booking.repository;

import com.fitnessgym.api.booking.entity.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassBookingRepository
        extends JpaRepository<ClassBooking, Long> {

    // =========================================================
    // CHECK CONFIRMED BOOKING
    // =========================================================

    @Query(
            value = """
                    SELECT COUNT(*)
                    FROM SYSTEM.CLASS_BOOKING
                    WHERE MEMBER_ID = :memberId
                      AND OCCURRENCE_ID = :occurrenceId
                      AND BOOKING_STATUS = 'CONFIRMED'
                    """,
            nativeQuery = true
    )
    long countByMemberAndOccurrence(
            @Param("memberId") Long memberId,
            @Param("occurrenceId") Long occurrenceId
    );


    // =========================================================
    // FIND BOOKING BY ID
    // =========================================================

    Optional<ClassBooking> findByBookingId(
            Long bookingId
    );


    // =========================================================
    // FIND ALL BOOKINGS
    // =========================================================

    List<ClassBooking> findAllByOrderByBookedAtDesc();


    // =========================================================
    // FIND BOOKINGS FOR OCCURRENCE
    // =========================================================

    List<ClassBooking> findByOccurrence_OccurrenceId(
            Long occurrenceId
    );


    // =========================================================
    // FIND BOOKINGS FOR MEMBER
    // =========================================================

    List<ClassBooking> findByMember_IdOrderByBookedAtDesc(
            Long memberId
    );


    // =========================================================
    // FIND BOOKINGS FOR TRAINER'S CLASSES
    // =========================================================

    List<ClassBooking>
    findByOccurrence_GymClass_TrainerIdOrderByBookedAtDesc(
            Long trainerId
    );
}