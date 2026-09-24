package com.fitnessgym.api.membership.service;

import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.membership.dto.response.MembershipPlanResponse;
import com.fitnessgym.api.membership.entity.MembershipPlan;
import com.fitnessgym.api.membership.mapper.MembershipPlanMapper;
import com.fitnessgym.api.membership.repository.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MembershipPlanService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final MembershipPlanMapper membershipPlanMapper;

    public List<MembershipPlanResponse> getActiveMembershipPlans() {

        List<MembershipPlan> plans =
                membershipPlanRepository.findByPlanStatus("ACTIVE");

        return plans.stream()
                .map(membershipPlanMapper::toResponse)
                .toList();
    }

    public MembershipPlanResponse getMembershipPlanById(Long planId) {

        MembershipPlan membershipPlan =
                membershipPlanRepository.findById(planId)
                                        .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Membership plan not found"
                        ));

        return membershipPlanMapper.toResponse(membershipPlan);
    }
}