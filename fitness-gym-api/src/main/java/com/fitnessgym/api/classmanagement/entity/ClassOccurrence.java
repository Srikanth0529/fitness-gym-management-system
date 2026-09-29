package com.fitnessgym.api.classmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CLASS_OCCURRENCE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassOccurrence {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "class_occurrence_seq"
    )
    @SequenceGenerator(
            name = "class_occurrence_seq",
            sequenceName = "CLASS_OCCURRENCE_SEQ",
            allocationSize = 1
    )
    @Column(name = "OCCURRENCE_ID")
    private Long occurrenceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "CLASS_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_OCCURRENCE_CLASS")
    )
    private GymClass gymClass;

    @Column(name = "START_TIME", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "END_TIME", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "CAPACITY", nullable = false)
    private Integer capacity;

    @Column(name = "CURRENT_BOOKINGS", nullable = false)
    private Integer currentBookings;

    @Column(
            name = "OCCURRENCE_STATUS",
            nullable = false,
            length = 30
    )
    private String occurrenceStatus;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (currentBookings == null) {
            currentBookings = 0;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}