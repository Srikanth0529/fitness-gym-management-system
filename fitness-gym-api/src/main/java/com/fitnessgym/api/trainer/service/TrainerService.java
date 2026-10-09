package com.fitnessgym.api.trainer.service;

import com.fitnessgym.api.common.enums.AccountStatus;
import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.trainer.dto.request.TrainerRegistrationRequest;
import com.fitnessgym.api.trainer.dto.request.UpdateTrainerRequest;
import com.fitnessgym.api.trainer.dto.response.TrainerResponse;
import com.fitnessgym.api.trainer.entity.Trainer;
import com.fitnessgym.api.trainer.mapper.TrainerMapper;
import com.fitnessgym.api.trainer.repository.TrainerRepository;
import com.fitnessgym.api.user.entity.Role;
import com.fitnessgym.api.user.entity.User;
import com.fitnessgym.api.user.repository.UserRepository;
import com.fitnessgym.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainerService {

    private final TrainerRepository trainerRepository;

    private final UserRepository userRepository;

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private final TrainerMapper trainerMapper;


    // =========================================================
    // TRAINER REGISTRATION
    // =========================================================

    public TrainerResponse register(
            TrainerRegistrationRequest request
    ) {

        userService.validateEmailNotExists(
                request.getEmail()
        );

        Role trainerRole =
                userService.getRole(
                        RoleName.TRAINER
                );

        User user =
                User.builder()
                        .email(request.getEmail())
                        .passwordHash(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .role(trainerRole)
                        .accountStatus(
                                AccountStatus.INACTIVE
                        )
                        .build();

        User savedUser =
                userRepository.save(user);

        Trainer trainer =
                Trainer.builder()
                        .user(savedUser)
                        .firstName(
                                request.getFirstName()
                        )
                        .lastName(
                                request.getLastName()
                        )
                        .phone(
                                request.getPhone()
                        )
                        .specialization(
                                request.getSpecialization()
                        )
                        .experienceYears(
                                request.getExperienceYears()
                        )
                        .bio(
                                request.getBio()
                        )
                        .approvalStatus(
                                ApprovalStatus.PENDING
                        )
                        .build();

        Trainer savedTrainer =
                trainerRepository.save(
                        trainer
                );

        return trainerMapper.toResponse(
                savedTrainer
        );
    }


    // =========================================================
    // GET ALL TRAINERS
    // ADMIN ONLY
    // =========================================================

    @Transactional(readOnly = true)
    public List<TrainerResponse> getAllTrainers() {

        return trainerRepository.findAll()
                .stream()
                .map(trainerMapper::toResponse)
                .toList();
    }


    // =========================================================
    // GET TRAINER BY ID
    //
    // TRAINER -> Own profile
    // ADMIN   -> Any trainer
    // =========================================================

    @Transactional(readOnly = true)
    public TrainerResponse getTrainerById(
            Long userId,
            Long trainerId,
            boolean admin
    ) {

        Trainer trainer =
                trainerRepository.findById(
                        trainerId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Trainer not found with id: "
                                        + trainerId
                        )
                );

        if (!admin
                && !trainer.getUser()
                .getId()
                .equals(userId)) {

            throw new BusinessException(
                    "You are not authorized to access "
                            + "this trainer profile"
            );
        }

        return trainerMapper.toResponse(
                trainer
        );
    }


    // =========================================================
    // UPDATE TRAINER
    //
    // TRAINER -> Own profile
    // ADMIN   -> Any trainer
    // =========================================================

    public TrainerResponse updateTrainer(
            Long userId,
            Long trainerId,
            boolean admin,
            UpdateTrainerRequest request
    ) {

        Trainer trainer =
                trainerRepository.findById(
                        trainerId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Trainer not found with id: "
                                        + trainerId
                        )
                );

        if (!admin
                && !trainer.getUser()
                .getId()
                .equals(userId)) {

            throw new BusinessException(
                    "You are not authorized to update "
                            + "this trainer profile"
            );
        }

        User user =
                trainer.getUser();


        // -----------------------------------------------------
        // EMAIL UNIQUENESS
        // -----------------------------------------------------

        if (!user.getEmail()
                .equalsIgnoreCase(
                        request.getEmail()
                )
                && userRepository.countByEmail(
                        request.getEmail()
                ) > 0) {

            throw new BusinessException(
                    "Email is already registered"
            );
        }

        user.setEmail(
                request.getEmail()
        );


        // -----------------------------------------------------
        // TRAINER DATA
        // -----------------------------------------------------

        trainer.setFirstName(
                request.getFirstName()
        );

        trainer.setLastName(
                request.getLastName()
        );

        trainer.setPhone(
                request.getPhone()
        );

        trainer.setSpecialization(
                request.getSpecialization()
        );

        trainer.setExperienceYears(
                request.getExperienceYears()
        );

        trainer.setBio(
                request.getBio()
        );

        trainerRepository.save(
                trainer
        );

        return trainerMapper.toResponse(
                trainer
        );
    }


    // =========================================================
    // UPDATE TRAINER APPROVAL
    // ADMIN ONLY
    // =========================================================

    public TrainerResponse updateApprovalStatus(
            Long trainerId,
            ApprovalStatus approvalStatus
    ) {

        if (approvalStatus
                == ApprovalStatus.PENDING) {

            throw new BusinessException(
                    "Approval status must be APPROVED "
                            + "or REJECTED"
            );
        }

        Trainer trainer =
                trainerRepository.findById(
                        trainerId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Trainer not found with id: "
                                        + trainerId
                        )
                );

        if (trainer.getApprovalStatus()
                == approvalStatus) {

            throw new BusinessException(
                    "Trainer is already "
                            + approvalStatus
            );
        }

        trainer.setApprovalStatus(
                approvalStatus
        );


        // -----------------------------------------------------
        // Synchronize account status
        // -----------------------------------------------------

        if (approvalStatus
                == ApprovalStatus.APPROVED) {

            trainer.getUser()
                    .setAccountStatus(
                            AccountStatus.ACTIVE
                    );

        } else {

            trainer.getUser()
                    .setAccountStatus(
                            AccountStatus.INACTIVE
                    );
        }

        trainerRepository.save(
                trainer
        );

        return trainerMapper.toResponse(
                trainer
        );
    }


    // =========================================================
    // UPDATE TRAINER ACCOUNT STATUS
    // ADMIN ONLY
    // =========================================================

    public TrainerResponse updateAccountStatus(
            Long trainerId,
            String status
    ) {

        AccountStatus accountStatus;

        try {

            accountStatus =
                    AccountStatus.valueOf(
                            status
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (Exception ex) {

            throw new BusinessException(
                    "Invalid account status. " +
                    "Allowed values: ACTIVE, INACTIVE, " +
                    "SUSPENDED, LOCKED"
            );
        }

        Trainer trainer =
                trainerRepository.findById(
                        trainerId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Trainer not found with id: "
                                        + trainerId
                        )
                );


        // -----------------------------------------------------
        // ACTIVE account requires approved trainer
        // -----------------------------------------------------

        if (accountStatus
                == AccountStatus.ACTIVE
                && trainer.getApprovalStatus()
                != ApprovalStatus.APPROVED) {

            throw new BusinessException(
                    "Trainer must be approved before "
                            + "the account can be activated"
            );
        }


        if (trainer.getUser()
                .getAccountStatus()
                == accountStatus) {

            throw new BusinessException(
                    "Trainer account is already "
                            + accountStatus
            );
        }

        trainer.getUser()
                .setAccountStatus(
                        accountStatus
                );

        trainerRepository.save(
                trainer
        );

        return trainerMapper.toResponse(
                trainer
        );
    }


    // =========================================================
    // GET TRAINER ENTITY BY USER ID
    // =========================================================

    @Transactional(readOnly = true)
    public Trainer getTrainerEntityByUserId(
            Long userId
    ) {

        return trainerRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Trainer not found for user id: "
                                        + userId
                        )
                );
    }
}