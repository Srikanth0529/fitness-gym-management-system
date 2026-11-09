
package com.fitnessgym.api.attendance.repository;

import com.fitnessgym.api.attendance.entity.Attendance;
import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.trainer.entity.Trainer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByMemberAndAttendanceDate(
            Member member,
            LocalDate attendanceDate
    );

    boolean existsByMemberAndAttendanceDate(
            Member member,
            LocalDate attendanceDate
    );

    Optional<Attendance> findByTrainerAndAttendanceDate(
            Trainer trainer,
            LocalDate attendanceDate
    );

    boolean existsByTrainerAndAttendanceDate(
            Trainer trainer,
            LocalDate attendanceDate
    );

    List<Attendance> findAllByMemberAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Attendance> findAllByTrainerAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Trainer trainer,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Attendance> findAllByAttendanceDateAndAttendanceTypeOrderByCheckInTimeDesc(
            LocalDate attendanceDate,
            Attendance.AttendanceType attendanceType
    );
}
