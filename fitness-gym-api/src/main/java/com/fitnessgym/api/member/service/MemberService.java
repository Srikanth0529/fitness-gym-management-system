package com.fitnessgym.api.member.service;

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

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;

    @Transactional(readOnly = true)
    public MemberResponse getMemberById(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + memberId
                        )
                );

        return memberMapper.toResponse(member);
    }

    @Transactional(readOnly = true)
    public Member getMemberEntityByUserId(Long userId) {

        return memberRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found for user id: " + userId
                        )
                );
    }

    @Transactional(readOnly = true)
    public MemberResponse getMyProfile(
            Long userId,
            Long memberId
    ) {

        Member member = getMemberEntityByUserId(userId);

        validateOwnership(member, memberId);

        return memberMapper.toResponse(member);
    }

    public MemberResponse updateMyProfile(
            Long userId,
            Long memberId,
            UpdateMemberRequest request
    ) {

        Member member = getMemberEntityByUserId(userId);

        validateOwnership(member, memberId);

        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setPhone(request.getPhone());
        member.setDateOfBirth(request.getDateOfBirth());
        member.setGender(request.getGender());
        member.setAddress(request.getAddress());

        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);
    }

    public MemberResponse updateApprovalStatus(
            Long memberId,
            ApprovalStatus approvalStatus
    ) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found with id: " + memberId
                        )
                );

        if (member.getApprovalStatus() == approvalStatus) {
            throw new BusinessException(
                    "Member is already " + approvalStatus
            );
        }

        member.setApprovalStatus(approvalStatus);

        Member updatedMember = memberRepository.save(member);

        return memberMapper.toResponse(updatedMember);
    }

    private void validateOwnership(
            Member member,
            Long requestedMemberId
    ) {

        if (!member.getId().equals(requestedMemberId)) {

            throw new BusinessException(
                    "You are not authorized to access this member profile"
            );
        }
    }
}