package com.fitnessgym.api.booking.repository;

import com.fitnessgym.api.booking.entity.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClassBookingRepository
        extends JpaRepository<ClassBooking, Long> {

    @Query(
            value = """
                    SELECT COUNT(*)
                    FROM SYSTEM.CLASS_BOOKING
                    WHERE MEMBER_ID = :memberId
                      AND OCCURRENCE_ID = :occurrenceId
                    """,
            nativeQuery = true
    )
    long countByMemberAndOccurrence(
            @Param("memberId") Long memberId,
            @Param("occurrenceId") Long occurrenceId
    );

    Optional<ClassBooking> findByBookingId(Long bookingId);
}