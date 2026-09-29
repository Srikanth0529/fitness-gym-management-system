package com.fitnessgym.api.booking.entity;

import com.fitnessgym.api.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import com.fitnessgym.api.classmanagement.entity.ClassOccurrence;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "CLASS_BOOKING",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_booking_member_occurrence",
                        columnNames = {"MEMBER_ID", "OCCURRENCE_ID"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassBooking {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "class_booking_seq"
    )
    @SequenceGenerator(
            name = "class_booking_seq",
            sequenceName = "CLASS_BOOKING_SEQ",
            allocationSize = 1
    )
    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "MEMBER_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_BOOKING_MEMBER")
    )
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "OCCURRENCE_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_BOOKING_OCCURRENCE")
    )
    private ClassOccurrence occurrence;

    @Column(
            name = "BOOKING_STATUS",
            nullable = false,
            length = 30
    )
    private String bookingStatus;

    @Column(name = "BOOKED_AT", nullable = false)
    private LocalDateTime bookedAt;

    @Column(name = "CANCELLED_AT")
    private LocalDateTime cancelledAt;

    @PrePersist
    protected void onCreate() {
        if (bookedAt == null) {
            bookedAt = LocalDateTime.now();
        }
    }
}