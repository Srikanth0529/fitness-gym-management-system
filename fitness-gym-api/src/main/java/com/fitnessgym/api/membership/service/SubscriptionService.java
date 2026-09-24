package com.fitnessgym.api.membership.service;

import com.fitnessgym.api.common.exception.BusinessException;
import com.fitnessgym.api.common.exception.ResourceNotFoundException;
import com.fitnessgym.api.member.entity.Member;
import com.fitnessgym.api.member.repository.MemberRepository;
import com.fitnessgym.api.membership.dto.request.CreateSubscriptionRequest;
import com.fitnessgym.api.membership.dto.response.SubscriptionResponse;
import com.fitnessgym.api.membership.entity.MembershipPlan;
import com.fitnessgym.api.membership.entity.Subscription;
import com.fitnessgym.api.membership.mapper.SubscriptionMapper;
import com.fitnessgym.api.membership.repository.MembershipPlanRepository;
import com.fitnessgym.api.membership.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final MemberRepository memberRepository;
    private final SubscriptionMapper subscriptionMapper;

    public SubscriptionResponse createSubscription(
            Long userId,
            CreateSubscriptionRequest request
    ) {

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member profile not found"
                        )
                );

        MembershipPlan plan =
                membershipPlanRepository.findById(request.getPlanId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Membership plan not found"
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(plan.getPlanStatus())) {
            throw new BusinessException(
                    "Membership plan is not active"
            );
        }

        boolean activeSubscription =
                !subscriptionRepository
                        .findAllByMemberAndStatus(member, "ACTIVE")
                        .isEmpty();

        if (activeSubscription) {
            throw new BusinessException(
                    "Member already has an active membership"
            );
        }

        LocalDate startDate = LocalDate.now();

        LocalDate endDate =
                startDate.plusDays(plan.getDurationDays());

        Subscription subscription =
                Subscription.builder()
                        .member(member)
                        .plan(plan)
                        .startDate(startDate)
                        .endDate(endDate)
                        .status("ACTIVE")
                        .build();

        Subscription savedSubscription =
                subscriptionRepository.save(subscription);

        return subscriptionMapper.toResponse(savedSubscription);
    }

    public SubscriptionResponse getCurrentSubscription(Long userId) {

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member profile not found"
                        )
                );

        Subscription subscription =
                subscriptionRepository.findByMemberAndStatus(
                        member,
                        "ACTIVE"
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Active membership not found"
                        )
                );

        return subscriptionMapper.toResponse(subscription);
    }
}