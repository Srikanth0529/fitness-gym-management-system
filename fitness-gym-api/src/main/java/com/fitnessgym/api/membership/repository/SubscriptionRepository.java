package com.fitnessgym.api.membership.repository;

import com.fitnessgym.api.membership.entity.Subscription;
import com.fitnessgym.api.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface SubscriptionRepository
        extends JpaRepository<Subscription, Long> {

     List<Subscription> findAllByMemberAndStatus(
            Member member,
            String status
    );

    Optional<Subscription> findByMemberAndStatus(
            Member member,
            String status
    );
}