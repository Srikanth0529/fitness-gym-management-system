
package com.fitnessgym.api.attendance.service;

import com.fitnessgym.api.attendance.dto.response.AttendanceResponse;
import com.fitnessgym.api.attendance.entity.Attendance;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceSource;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceStatus;
import com.fitnessgym.api.attendance.entity.Attendance.AttendanceType;
import com.fitnessgym.api.attendance.mapper.AttendanceMapper;
import com.fitnessgym.api.attendance.repository.AttendanceRepository;

import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;

import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.member.repository.MemberRepository;

import com.fitnessgym.api.membership.entity.Subscription;
import com.fitnessgym.api.membership.repository.SubscriptionRepository;

import com.fitnessgym.api.trainer.entity.Trainer;
import com.fitnessgym.api.trainer.repository.TrainerRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AttendanceMapper attendanceMapper;

    // MEMBER CHECK-IN

    public AttendanceResponse memberCheckIn(Long userId, String remarks) {

        Member member = getMemberByUserId(userId);

        validateActiveMembership(member);

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        Attendance attendance = attendanceRepository
                .findByMemberAndAttendanceDate(member, today)
                .orElse(null);

        if (attendance == null) {

            attendance = new Attendance();

            attendance.setMember(member);
            attendance.setAttendanceType(AttendanceType.MEMBER);
            attendance.setAttendanceDate(today);

            attendance.setCheckInTime(now);
            attendance.setLastVisitTime(now);
            attendance.setCheckOutTime(null);

            attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
            attendance.setAttendanceSource(
                    AttendanceSource.MEMBER_SELF_CHECK_IN
            );

        } else {

            validateMemberAttendance(attendance);

            if (attendance.getAttendanceStatus() == AttendanceStatus.PRESENT) {
                throw new BusinessException(
                        "You are already checked in. Please check out before your next visit."
                );
            }

            // Preserve the first check-in time.
            attendance.setLastVisitTime(now);
            attendance.setCheckOutTime(null);
            attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
            attendance.setAttendanceSource(
                    AttendanceSource.MEMBER_SELF_CHECK_IN
            );
        }

        attendance.setRemarks(remarks);

        try {
            attendanceRepository.saveAndFlush(attendance);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException(
                    "Attendance has already been recorded for today."
            );
        }

        return toResponse(attendance);
    }

    // MEMBER CHECK-OUT

    public AttendanceResponse memberCheckOut(Long userId) {

        Member member = getMemberByUserId(userId);

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByMemberAndAttendanceDate(member, today)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No attendance record found for today."
                ));

        validateMemberAttendance(attendance);

        if (attendance.getAttendanceStatus() == AttendanceStatus.CHECKED_OUT) {
            throw new BusinessException("You have already checked out.");
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setAttendanceStatus(AttendanceStatus.CHECKED_OUT);

        attendanceRepository.save(attendance);

        return toResponse(attendance);
    }

    // TRAINER MARKS MEMBER ATTENDANCE

    public AttendanceResponse trainerMarkMemberAttendance(
            Long trainerUserId,
            Long memberId,
            String remarks
    ) {

        Trainer trainer = getTrainerByUserId(trainerUserId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Member not found with ID: " + memberId
                ));

        // No TrainerClient assignment validation.
        validateActiveMembership(member);

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        Attendance attendance = attendanceRepository
                .findByMemberAndAttendanceDate(member, today)
                .orElse(null);

        if (attendance == null) {

            attendance = new Attendance();

            attendance.setMember(member);
            attendance.setAttendanceType(AttendanceType.MEMBER);
            attendance.setAttendanceDate(today);

            attendance.setCheckInTime(now);
            attendance.setLastVisitTime(now);
            attendance.setCheckOutTime(null);

            attendance.setAttendanceStatus(AttendanceStatus.PRESENT);

        } else {

            validateMemberAttendance(attendance);

            if (attendance.getAttendanceStatus() == AttendanceStatus.PRESENT) {
                throw new BusinessException(
                        "Member attendance has already been recorded and the Member is currently checked in."
                );
            }

            attendance.setLastVisitTime(now);
            attendance.setCheckOutTime(null);
            attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
        }

        attendance.setAttendanceSource(AttendanceSource.TRAINER_MARKED);
        attendance.setMarkedByTrainer(trainer);
        attendance.setRemarks(remarks);

        try {
            attendanceRepository.saveAndFlush(attendance);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException(
                    "Member attendance has already been recorded for today."
            );
        }

        return toResponse(attendance);
    }

    // TRAINER WORKING-HOURS CHECK-IN

    public AttendanceResponse trainerCheckIn(Long userId) {

        Trainer trainer = getTrainerByUserId(userId);

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        Attendance attendance = attendanceRepository
                .findByTrainerAndAttendanceDate(trainer, today)
                .orElse(null);

        if (attendance != null) {

            if (attendance.getAttendanceStatus() == AttendanceStatus.PRESENT) {
                throw new BusinessException(
                        "You are already checked in for today's shift."
                );
            }

            throw new BusinessException(
                    "Trainer attendance has already been completed for today."
            );
        }

        attendance = new Attendance();

        attendance.setTrainer(trainer);
        attendance.setAttendanceType(AttendanceType.TRAINER);
        attendance.setAttendanceDate(today);

        attendance.setCheckInTime(now);
        attendance.setLastVisitTime(null);
        attendance.setCheckOutTime(null);

        attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
        attendance.setAttendanceSource(
                AttendanceSource.TRAINER_SELF_CHECK_IN
        );

        attendanceRepository.save(attendance);

        return toResponse(attendance);
    }

    // TRAINER WORKING-HOURS CHECK-OUT

    public AttendanceResponse trainerCheckOut(Long userId) {

        Trainer trainer = getTrainerByUserId(userId);

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByTrainerAndAttendanceDate(trainer, today)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No trainer attendance record found for today."
                ));

        if (attendance.getAttendanceType() != AttendanceType.TRAINER) {
            throw new BusinessException("Invalid trainer attendance record.");
        }

        if (attendance.getAttendanceStatus() == AttendanceStatus.CHECKED_OUT) {
            throw new BusinessException(
                    "You have already checked out for today."
            );
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setAttendanceStatus(AttendanceStatus.CHECKED_OUT);

        attendanceRepository.save(attendance);

        return toResponse(attendance);
    }

    // MEMBER ATTENDANCE HISTORY

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMemberAttendanceHistory(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        Member member = getMemberByUserId(userId);

        validateDateRange(startDate, endDate);

        return attendanceRepository
                .findAllByMemberAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                        member,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // TRAINER ATTENDANCE HISTORY

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getTrainerAttendanceHistory(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        Trainer trainer = getTrainerByUserId(userId);

        validateDateRange(startDate, endDate);

        return attendanceRepository
                .findAllByTrainerAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                        trainer,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ADMIN: VIEW ATTENDANCE BY DATE AND TYPE

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByDate(
            LocalDate date,
            AttendanceType attendanceType
    ) {

        if (date == null || attendanceType == null) {
            throw new BusinessException(
                    "Attendance date and type are required."
            );
        }

        return attendanceRepository
                .findAllByAttendanceDateAndAttendanceTypeOrderByCheckInTimeDesc(
                        date,
                        attendanceType
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // VALIDATION METHODS

    private Member getMemberByUserId(Long userId) {

        return memberRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Member profile not found."
                ));
    }

    private Trainer getTrainerByUserId(Long userId) {

        return trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Trainer profile not found."
                ));
    }

    private void validateActiveMembership(Member member) {

        Subscription subscription = subscriptionRepository
                .findByMemberAndStatus(member, "ACTIVE")
                .orElseThrow(() -> new BusinessException(
                        "An active membership is required to check in."
                ));

        LocalDate today = LocalDate.now();

        if (subscription.getStartDate() == null
                || subscription.getEndDate() == null
                || today.isBefore(subscription.getStartDate())
                || today.isAfter(subscription.getEndDate())) {

            throw new BusinessException(
                    "Your membership is not valid for today's attendance."
            );
        }
    }

    private void validateMemberAttendance(Attendance attendance) {

        if (attendance.getAttendanceType() != AttendanceType.MEMBER
                || attendance.getMember() == null) {

            throw new BusinessException(
                    "Invalid Member attendance record."
            );
        }
    }

    private void validateDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate == null || endDate == null) {
            throw new BusinessException(
                    "Start date and end date are required."
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new BusinessException(
                    "Start date cannot be after end date."
            );
        }
    }

    // ENTITY TO RESPONSE DTO

    private AttendanceResponse toResponse(Attendance attendance) {

        AttendanceResponse response =
                attendanceMapper.toResponse(attendance);

        if (attendance.getMember() != null) {
            response.setMemberId(attendance.getMember().getId());
        }

        if (attendance.getTrainer() != null) {
            response.setTrainerId(attendance.getTrainer().getId());
        }

        return response;
    }
}
