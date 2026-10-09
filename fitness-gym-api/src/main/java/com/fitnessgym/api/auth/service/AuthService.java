package com.fitnessgym.api.auth.service;

import com.fitnessgym.api.auth.dto.request.LoginRequest;
import com.fitnessgym.api.auth.dto.request.RegisterRequest;
import com.fitnessgym.api.auth.dto.response.CurrentUserResponse;
import com.fitnessgym.api.auth.dto.response.LoginResponse;
import com.fitnessgym.api.common.enums.AccountStatus;
import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.member.repository.MemberRepository;
import com.fitnessgym.api.security.jwt.JwtService;
import com.fitnessgym.api.trainer.entity.Trainer;
import com.fitnessgym.api.trainer.repository.TrainerRepository;
import com.fitnessgym.api.user.entity.Role;
import com.fitnessgym.api.user.entity.User;
import com.fitnessgym.api.user.repository.UserRepository;
import com.fitnessgym.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {

        // 1. Validate email uniqueness
        userService.validateEmailNotExists(request.getEmail());

        // 2. Get MEMBER role
        Role memberRole = userService.getRole(RoleName.MEMBER);

        // 3. Hash password
        String passwordHash =
                passwordEncoder.encode(request.getPassword());

        // 4. Create User
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordHash)
                .role(memberRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // 5. Create Member
        Member member = Member.builder()
                .user(savedUser)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .approvalStatus(ApprovalStatus.PENDING)
                .joinDate(LocalDate.now())
                .build();

        memberRepository.save(member);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BusinessException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new BusinessException(
                    "Invalid email or password"
            );
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(
                    "Account is not active"
            );
        }

        Long memberId = null;
        Long trainerId = null;

        /*
         * MEMBER login
         */
        if (user.getRole().getRoleName() == RoleName.MEMBER) {

            Member member = memberRepository.findByUserId(user.getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Member not found for user id: "
                                            + user.getId()
                            )
                    );

            if (member.getApprovalStatus()
                    != ApprovalStatus.APPROVED) {

                throw new BusinessException(
                        "Member account is not approved"
                );
            }

            memberId = member.getId();
        }

        /*
         * TRAINER login
         */
        if (user.getRole().getRoleName() == RoleName.TRAINER) {

            Trainer trainer = trainerRepository.findByUserId(user.getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Trainer not found for user id: "
                                            + user.getId()
                            )
                    );

            if (trainer.getApprovalStatus()
                    != ApprovalStatus.APPROVED) {

                throw new BusinessException(
                        "Trainer account is not approved"
                );
            }

            trainerId = trainer.getId();
        }

        /*
         * Generate JWT tokens
         */
        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .userId(user.getId())
                .memberId(memberId)
                .trainerId(trainerId)
                .email(user.getEmail())
                .role(user.getRole().getRoleName().name())
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public CurrentUserResponse getCurrentUser(
            Authentication authentication
    ) {

        Long userId = Long.valueOf(authentication.getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        return CurrentUserResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().getRoleName().name())
                .accountStatus(
                        user.getAccountStatus().name()
                )
                .build();
    }
}