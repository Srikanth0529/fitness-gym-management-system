
package com.fitnessgym.api.attendance.dto.response;

import com.fitnessgym.api.attendance.entity.Attendance.AttendanceSource;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceStatus;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceResponse {

    private Long attendanceId;

    private Long memberId;

    private Long trainerId;

    private AttendanceType attendanceType;

    private LocalDate attendanceDate;

    private LocalDateTime checkInTime;

    private LocalDateTime lastVisitTime;

    private LocalDateTime checkOutTime;

    private AttendanceStatus attendanceStatus;

    private AttendanceSource attendanceSource;

    private String remarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
