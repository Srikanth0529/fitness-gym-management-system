package com.fitnessgym.api.classmanagement.service;

import com.fitnessgym.api.booking.service.BookingService;
import com.fitnessgym.api.classmanagement.dto.request.CreateClassOccurrenceRequest;
import com.fitnessgym.api.classmanagement.dto.request.CreateClassRequest;
import com.fitnessgym.api.classmanagement.dto.request.UpdateClassOccurrenceRequest;
import com.fitnessgym.api.classmanagement.dto.request.UpdateClassRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassOccurrenceResponse;
import com.fitnessgym.api.classmanagement.dto.response.ClassResponse;
import com.fitnessgym.api.classmanagement.entity.ClassOccurrence;
import com.fitnessgym.api.common.enums.ClassStatus;
import com.fitnessgym.api.classmanagement.entity.GymClass;
import com.fitnessgym.api.classmanagement.mapper.GymClassMapper;
import com.fitnessgym.api.classmanagement.repository.ClassOccurrenceRepository;
import com.fitnessgym.api.classmanagement.repository.GymClassRepository;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.trainer.service.TrainerService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassService {

    private final GymClassRepository gymClassRepository;
    private final ClassOccurrenceRepository classOccurrenceRepository;
    private final GymClassMapper gymClassMapper;
    private final TrainerService trainerService;
    private final BookingService bookingService;


    // =========================================================
    // CREATE CLASS
    // ADMIN + TRAINER
    // =========================================================

    public ClassResponse createClass(
            CreateClassRequest request,
            Authentication authentication
    ) {

        boolean admin = isAdmin(authentication);
        boolean trainer = isTrainer(authentication);

        validateTrainerAssignment(
                request.getTrainerId(),
                authentication,
                admin,
                trainer
        );

        GymClass gymClass =
                gymClassMapper.toEntity(request);

        gymClass.setClassStatus(ClassStatus.ACTIVE);

        GymClass savedClass =
                gymClassRepository.save(gymClass);

        return gymClassMapper.toResponse(savedClass);
    }


    // =========================================================
    // GET ALL CLASSES
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @Transactional(readOnly = true)
    public List<ClassResponse> getClasses(
            ClassStatus status,
            Long trainerId,
            Authentication authentication
    ) {

        boolean admin = isAdmin(authentication);
        boolean trainer = isTrainer(authentication);

        List<GymClass> classes;

        if (trainer) {

            Long currentTrainerId =
                    getCurrentTrainerId(authentication);

            if (trainerId != null &&
                    !trainerId.equals(currentTrainerId)) {

                throw new BusinessException(
                        "Trainer can view only their own classes"
                );
            }

            if (status != null) {

                classes =
                        gymClassRepository
                                .findByTrainerIdAndClassStatus(
                                        currentTrainerId,
                                        status
                                );

            } else {

                classes =
                        gymClassRepository
                                .findByTrainerId(
                                        currentTrainerId
                                );
            }

        } else if (admin) {

            if (trainerId != null) {

                if (status != null) {

                    classes =
                            gymClassRepository
                                    .findByTrainerIdAndClassStatus(
                                            trainerId,
                                            status
                                    );

                } else {

                    classes =
                            gymClassRepository
                                    .findByTrainerId(
                                            trainerId
                                    );
                }

            } else if (status != null) {

                classes =
                        gymClassRepository
                                .findByClassStatus(status);

            } else {

                classes =
                        gymClassRepository.findAll();
            }

        } else {

            // MEMBER

            if (trainerId != null) {

                if (status != null) {

                    classes =
                            gymClassRepository
                                    .findByTrainerIdAndClassStatus(
                                            trainerId,
                                            status
                                    );

                } else {

                    classes =
                            gymClassRepository
                                    .findByTrainerId(
                                            trainerId
                                    );
                }

            } else if (status != null) {

                classes =
                        gymClassRepository
                                .findByClassStatus(status);

            } else {

                classes =
                        gymClassRepository.findAll();
            }
        }

        return classes.stream()
                .map(gymClassMapper::toResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET CLASS BY ID
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @Transactional(readOnly = true)
    public ClassResponse getClassById(
            Long classId,
            Authentication authentication
    ) {

        GymClass gymClass =
                getClassEntity(classId);

        validateClassViewAccess(
                gymClass,
                authentication
        );

        return gymClassMapper.toResponse(gymClass);
    }


    // =========================================================
    // UPDATE CLASS
    // ADMIN + TRAINER
    // =========================================================

    public ClassResponse updateClass(
            Long classId,
            UpdateClassRequest request,
            Authentication authentication
    ) {

        GymClass gymClass =
                getClassEntity(classId);

        validateClassManageAccess(
                gymClass,
                authentication
        );

        boolean admin = isAdmin(authentication);
        boolean trainer = isTrainer(authentication);

        validateTrainerAssignment(
                request.getTrainerId(),
                authentication,
                admin,
                trainer
        );

        gymClass.setClassName(
                request.getClassName()
        );

        gymClass.setDescription(
                request.getDescription()
        );

        gymClass.setTrainerId(
                request.getTrainerId()
        );

        gymClass.setDefaultCapacity(
                request.getDefaultCapacity()
        );

        gymClass.setLocation(
                request.getLocation()
        );

        GymClass updatedClass =
                gymClassRepository.save(gymClass);

        return gymClassMapper.toResponse(updatedClass);
    }


    // =========================================================
    // UPDATE CLASS STATUS
    // ADMIN + TRAINER
    // =========================================================

    public ClassResponse updateClassStatus(
            Long classId,
            ClassStatus status,
            Authentication authentication
    ) {

        GymClass gymClass =
                getClassEntity(classId);

        validateClassManageAccess(
                gymClass,
                authentication
        );

        if (status == null) {

            throw new BusinessException(
                    "Class status is required"
            );
        }

        gymClass.setClassStatus(status);

        /*
         * If the class is cancelled,
         * cancel all active occurrences
         * and their bookings.
         */
        if (status == ClassStatus.CANCELLED) {

            List<ClassOccurrence> occurrences =
                    classOccurrenceRepository
                            .findByGymClass_ClassIdOrderByStartTimeAsc(
                                    classId
                            );

            for (ClassOccurrence occurrence : occurrences) {

                if (!"CANCELLED".equals(
                        occurrence.getOccurrenceStatus())) {

                    bookingService
                            .cancelBookingsForOccurrence(
                                      occurrence
                          );

                    occurrence.setOccurrenceStatus(
                            "CANCELLED"
                    );
                }
            }
        }

        GymClass updatedClass =
                gymClassRepository.save(gymClass);

        return gymClassMapper.toResponse(updatedClass);
    }


    // =========================================================
    // GET CLASS OCCURRENCES
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @Transactional(readOnly = true)
    public List<ClassOccurrenceResponse> getClassOccurrences(
            Long classId,
            Authentication authentication
    ) {

        GymClass gymClass =
                getClassEntity(classId);

        validateClassViewAccess(
                gymClass,
                authentication
        );

        List<ClassOccurrence> occurrences =
                classOccurrenceRepository
                        .findByGymClass_ClassIdOrderByStartTimeAsc(
                                classId
                        );

        return occurrences.stream()
                .map(this::toOccurrenceResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET OCCURRENCE BY ID
    // ADMIN + TRAINER + MEMBER
    // =========================================================

    @Transactional(readOnly = true)
    public ClassOccurrenceResponse getOccurrenceById(
            Long occurrenceId,
            Authentication authentication
    ) {

        ClassOccurrence occurrence =
                getOccurrenceEntity(occurrenceId);

        validateClassViewAccess(
                occurrence.getGymClass(),
                authentication
        );

        return toOccurrenceResponse(occurrence);
    }


    // =========================================================
    // CREATE OCCURRENCE
    // ADMIN + TRAINER
    // =========================================================

    public ClassOccurrenceResponse createOccurrence(
            Long classId,
            CreateClassOccurrenceRequest request,
            Authentication authentication
    ) {

        GymClass gymClass =
                getClassEntity(classId);

        validateClassManageAccess(
                gymClass,
                authentication
        );

        if (gymClass.getClassStatus() ==
                ClassStatus.CANCELLED) {

            throw new BusinessException(
                    "Cannot create occurrence for a cancelled class"
            );
        }

        validateOccurrenceTime(
                request.getStartTime(),
                request.getEndTime()
        );

        Integer capacity =
                request.getCapacity();

        if (capacity == null) {

            capacity =
                    gymClass.getDefaultCapacity();
        }

        if (capacity <= 0) {

            throw new BusinessException(
                    "Occurrence capacity must be greater than zero"
            );
        }

        ClassOccurrence occurrence =
                new ClassOccurrence();

        occurrence.setGymClass(gymClass);

        occurrence.setStartTime(
                request.getStartTime()
        );

        occurrence.setEndTime(
                request.getEndTime()
        );

        occurrence.setCapacity(capacity);

        occurrence.setCurrentBookings(0);

        occurrence.setOccurrenceStatus(
                "ACTIVE"
        );

        ClassOccurrence savedOccurrence =
                classOccurrenceRepository.save(
                        occurrence
                );

        return toOccurrenceResponse(savedOccurrence);
    }


    // =========================================================
    // UPDATE OCCURRENCE
    // ADMIN + TRAINER
    // =========================================================

    public ClassOccurrenceResponse updateOccurrence(
            Long occurrenceId,
            UpdateClassOccurrenceRequest request,
            Authentication authentication
    ) {

        ClassOccurrence occurrence =
                getOccurrenceEntity(occurrenceId);

        validateClassManageAccess(
                occurrence.getGymClass(),
                authentication
        );

        if ("CANCELLED".equals(
                occurrence.getOccurrenceStatus())) {

            throw new BusinessException(
                    "Cancelled occurrence cannot be updated"
            );
        }

        validateOccurrenceTime(
                request.getStartTime(),
                request.getEndTime()
        );

        if (request.getCapacity() <
                occurrence.getCurrentBookings()) {

            throw new BusinessException(
                    "Capacity cannot be less than current bookings"
            );
        }

        occurrence.setStartTime(
                request.getStartTime()
        );

        occurrence.setEndTime(
                request.getEndTime()
        );

        occurrence.setCapacity(
                request.getCapacity()
        );

        ClassOccurrence updatedOccurrence =
                classOccurrenceRepository.save(
                        occurrence
                );

        return toOccurrenceResponse(updatedOccurrence);
    }


    // =========================================================
    // CANCEL OCCURRENCE
    // ADMIN + TRAINER
    // =========================================================

    public ClassOccurrenceResponse cancelOccurrence(
            Long occurrenceId,
            Authentication authentication
    ) {

        ClassOccurrence occurrence =
                getOccurrenceEntity(occurrenceId);

        validateClassManageAccess(
                occurrence.getGymClass(),
                authentication
        );

        if ("CANCELLED".equals(
                occurrence.getOccurrenceStatus())) {

            return toOccurrenceResponse(occurrence);
        }

        bookingService
                .cancelBookingsForOccurrence(
                occurrence
        );

        occurrence.setOccurrenceStatus(
                "CANCELLED"
        );

        ClassOccurrence updatedOccurrence =
                classOccurrenceRepository.save(
                        occurrence
                );

        return toOccurrenceResponse(updatedOccurrence);
    }


    // =========================================================
    // CLASS ACCESS VALIDATION
    // =========================================================

    private void validateClassViewAccess(
            GymClass gymClass,
            Authentication authentication
    ) {

        /*
         * ADMIN and MEMBER can view any class.
         *
         * TRAINER can view only their own classes.
         */
        if (isTrainer(authentication)) {

            Long currentTrainerId =
                    getCurrentTrainerId(authentication);

            if (!currentTrainerId.equals(
                    gymClass.getTrainerId())) {

                throw new BusinessException(
                        "Trainer can access only their own classes"
                );
            }
        }
    }


    private void validateClassManageAccess(
            GymClass gymClass,
            Authentication authentication
    ) {

        /*
         * ADMIN can manage every class.
         */
        if (isAdmin(authentication)) {
            return;
        }

        /*
         * TRAINER can manage only their own classes.
         */
        if (isTrainer(authentication)) {

            Long currentTrainerId =
                    getCurrentTrainerId(authentication);

            if (!currentTrainerId.equals(
                    gymClass.getTrainerId())) {

                throw new BusinessException(
                        "Trainer can manage only their own classes"
                );
            }

            return;
        }

        throw new BusinessException(
                "You are not authorized to manage this class"
        );
    }


    // =========================================================
    // TRAINER ASSIGNMENT VALIDATION
    // =========================================================

    private void validateTrainerAssignment(
            Long requestedTrainerId,
            Authentication authentication,
            boolean admin,
            boolean trainer
    ) {

        if (requestedTrainerId == null) {

            throw new BusinessException(
                    "Trainer is required"
            );
        }

        /*
         * Verify trainer exists.
         */
        validateTrainerExists(requestedTrainerId);

        /*
         * ADMIN can assign any existing trainer.
         */
        if (admin) {
            return;
        }

        /*
         * TRAINER can create/update a class
         * only for himself.
         */
        if (trainer) {

            Long currentTrainerId =
                    getCurrentTrainerId(authentication);

            if (!currentTrainerId.equals(
                    requestedTrainerId)) {

                throw new BusinessException(
                        "Trainer can create or update classes only for themselves"
                );
            }

            return;
        }

        throw new BusinessException(
                "You are not authorized to assign a trainer"
        );
    }


    private void validateTrainerExists(
            Long trainerId
    ) {

        try {

            trainerService.getTrainerById(
                    null,
                    trainerId,
                    true
            );

        } catch (Exception exception) {

            throw new ResourceNotFoundException(
                    "Trainer not found with id: " + trainerId
            );
        }
    }


    // =========================================================
    // ENTITY HELPERS
    // =========================================================

    private GymClass getClassEntity(
            Long classId
    ) {

        return gymClassRepository
                .findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found with id: " + classId
                        )
                );
    }


    private ClassOccurrence getOccurrenceEntity(
            Long occurrenceId
    ) {

        return classOccurrenceRepository
                .findById(occurrenceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class occurrence not found with id: "
                                        + occurrenceId
                        )
                );
    }


    // =========================================================
    // AUTHENTICATION HELPERS
    // =========================================================

    private boolean isAdmin(
            Authentication authentication
    ) {

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN")
                );
    }


    private boolean isTrainer(
            Authentication authentication
    ) {

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_TRAINER")
                );
    }


    private Long getAuthenticatedUserId(
            Authentication authentication
    ) {

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


    private Long getCurrentTrainerId(
            Authentication authentication
    ) {

        Long userId =
                getAuthenticatedUserId(authentication);

        try {

            return trainerService
                    .getTrainerEntityByUserId(userId)
                    .getId();

        } catch (Exception exception) {

            throw new ResourceNotFoundException(
                    "Trainer profile not found for current user"
            );
        }
    }


    // =========================================================
    // OCCURRENCE VALIDATION
    // =========================================================

    private void validateOccurrenceTime(
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {

        if (startTime == null ||
                endTime == null) {

            throw new BusinessException(
                    "Start time and end time are required"
            );
        }

        if (!endTime.isAfter(startTime)) {

            throw new BusinessException(
                    "End time must be after start time"
            );
        }
    }


    // =========================================================
    // OCCURRENCE RESPONSE MAPPER
    // =========================================================

    private ClassOccurrenceResponse toOccurrenceResponse(
            ClassOccurrence occurrence
    ) {

        return ClassOccurrenceResponse.builder()
                .occurrenceId(
                        occurrence.getOccurrenceId()
                )
                .classId(
                        occurrence.getGymClass()
                                .getClassId()
                )
                .className(
                        occurrence.getGymClass()
                                .getClassName()
                )
                .startTime(
                        occurrence.getStartTime()
                )
                .endTime(
                        occurrence.getEndTime()
                )
                .capacity(
                        occurrence.getCapacity()
                )
                .currentBookings(
                        occurrence.getCurrentBookings()
                )
                .occurrenceStatus(
                        occurrence.getOccurrenceStatus()
                )
                .createdAt(
                        occurrence.getCreatedAt()
                )
                .updatedAt(
                        occurrence.getUpdatedAt()
                )
                .build();
    }
}