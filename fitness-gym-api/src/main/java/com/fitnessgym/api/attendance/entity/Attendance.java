
package com.fitnessgym.api.attendance.entity;

import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.trainer.entity.Trainer;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "ATTENDANCE",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "UK_ATTENDANCE_MEMBER_DATE",
            columnNames = {"MEMBER_ID", "ATTENDANCE_DATE"}
        ),
        @UniqueConstraint(
            name = "UK_ATTENDANCE_TRAINER_DATE",
            columnNames = {"TRAINER_ID", "ATTENDANCE_DATE"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Attendance {

    public enum AttendanceType {
        MEMBER,
        TRAINER
    }

    public enum AttendanceStatus {
        PRESENT,
        CHECKED_OUT
    }

    public enum AttendanceSource {
        MEMBER_SELF_CHECK_IN,
        TRAINER_MARKED,
        TRAINER_SELF_CHECK_IN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTENDANCE_ID")
    private Long attendanceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ATTENDANCE_TYPE", nullable = false, length = 20)
    private AttendanceType attendanceType;

    @Column(name = "ATTENDANCE_DATE", nullable = false)
    private LocalDate attendanceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINER_ID")
    private Trainer trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MARKED_BY_TRAINER_ID")
    private Trainer markedByTrainer;

    // First check-in of the day.
    @Column(name = "CHECK_IN_TIME", nullable = false)
    private LocalDateTime checkInTime;

    // Latest Member visit of the day.
    @Column(name = "LAST_VISIT_TIME")
    private LocalDateTime lastVisitTime;

    // Latest checkout time.
    @Column(name = "CHECK_OUT_TIME")
    private LocalDateTime checkOutTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "ATTENDANCE_STATUS", nullable = false, length = 20)
    private AttendanceStatus attendanceStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "ATTENDANCE_SOURCE", nullable = false, length = 30)
    private AttendanceSource attendanceSource;

    @Column(name = "REMARKS", length = 500)
    private String remarks;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
