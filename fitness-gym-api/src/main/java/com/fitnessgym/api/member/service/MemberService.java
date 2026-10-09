package com.fitnessgym.api.member.service;

import com.fitnessgym.api.common.enums.AccountStatus;
import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.member.dto.request.UpdateMemberRequest;
import com.fitnessgym.api.member.dto.response.MemberResponse;
import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.member.mapper.MemberMapper;
import com.fitnessgym.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;


    // =========================================================
    // GET ALL MEMBERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<MemberResponse> getAllMembers() {

        return memberRepository.findAll()
                .stream()
                .map(memberMapper::toResponse)
                .toList();
    }


    // =========================================================
    // GET MEMBER BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public MemberResponse getMemberById(
            Long memberId
    ) {

        Member member =
                findMember(memberId);

        return memberMapper.toResponse(member);
    }


    // =========================================================
    // GET MEMBER ENTITY BY USER ID
    // =========================================================

    @Transactional(readOnly = true)
    public Member getMemberEntityByUserId(
            Long userId
    ) {

        return memberRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found for user id: "
                                        + userId
                        )
                );
    }


    // =========================================================
    // GET MEMBER PROFILE
    //
    // MEMBER -> Own profile
    // ADMIN  -> Any member
    // =========================================================

    @Transactional(readOnly = true)
    public MemberResponse getProfile(
            Long userId,
            Long memberId,
            boolean admin
    ) {

        Member member =
                findMember(memberId);

        if (!admin) {

            validateOwnership(
                    member,
                    memberId,
                    userId
            );
        }

        return memberMapper.toResponse(member);
    }


    // =========================================================
    // UPDATE MEMBER PROFILE
    //
    // MEMBER -> Own profile
    // ADMIN  -> Any member
    // =========================================================

    public MemberResponse updateProfile(
            Long userId,
            Long memberId,
            boolean admin,
            UpdateMemberRequest request
    ) {

        Member member =
                findMember(memberId);

        if (!admin) {

            validateOwnership(
                    member,
                    memberId,
                    userId
            );
        }

        member.setFirstName(
                request.getFirstName()
        );

        member.setLastName(
                request.getLastName()
        );

        member.setPhone(
                request.getPhone()
        );

        member.setDateOfBirth(
                request.getDateOfBirth()
        );

        member.setGender(
                request.getGender()
        );

        member.setAddress(
                request.getAddress()
        );

        Member updatedMember =
                memberRepository.save(member);

        return memberMapper.toResponse(
                updatedMember
        );
    }


    // =========================================================
    // UPDATE MEMBER APPROVAL
    // ADMIN ONLY
    // =========================================================

    public MemberResponse updateApprovalStatus(
            Long memberId,
            ApprovalStatus approvalStatus
    ) {

        if (approvalStatus == ApprovalStatus.PENDING) {

            throw new BusinessException(
                    "Approval status must be APPROVED or REJECTED"
            );
        }

        Member member =
                findMember(memberId);

        if (member.getApprovalStatus()
                == approvalStatus) {

            throw new BusinessException(
                    "Member is already "
                            + approvalStatus
            );
        }

        member.setApprovalStatus(
                approvalStatus
        );


        // -----------------------------------------------------
        // Synchronize account status
        // -----------------------------------------------------

        if (approvalStatus
                == ApprovalStatus.APPROVED) {

            member.getUser()
                    .setAccountStatus(
                            AccountStatus.ACTIVE
                    );

        } else {

            member.getUser()
                    .setAccountStatus(
                            AccountStatus.INACTIVE
                    );
        }


        Member updatedMember =
                memberRepository.save(member);

        return memberMapper.toResponse(
                updatedMember
        );
    }


    // =========================================================
    // UPDATE MEMBER ACCOUNT STATUS
    // ADMIN ONLY
    // =========================================================

    public MemberResponse updateAccountStatus(
            Long memberId,
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


        Member member =
                findMember(memberId);


        // -----------------------------------------------------
        // ACTIVE account requires approved member
        // -----------------------------------------------------

        if (accountStatus
                == AccountStatus.ACTIVE
                && member.getApprovalStatus()
                != ApprovalStatus.APPROVED) {

            throw new BusinessException(
                    "Member must be approved before " +
                    "the account can be activated"
            );
        }


        if (member.getUser()
                .getAccountStatus()
                == accountStatus) {

            throw new BusinessException(
                    "Member account is already "
                            + accountStatus
            );
        }


        member.getUser()
                .setAccountStatus(
                        accountStatus
                );

        Member updatedMember =
                memberRepository.save(member);

        return memberMapper.toResponse(
                updatedMember
        );
    }


    // =========================================================
    // FIND MEMBER
    // =========================================================

    private Member findMember(
            Long memberId
    ) {

        return memberRepository
                .findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: "
                                        + memberId
                        )
                );
    }


    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateOwnership(
            Member member,
            Long requestedMemberId,
            Long authenticatedUserId
    ) {

        if (!member.getId()
                .equals(requestedMemberId)
                || !member.getUser()
                .getId()
                .equals(authenticatedUserId)) {

            throw new BusinessException(
                    "You are not authorized to access " +
                    "this member profile"
            );
        }
    }
}