package com.fitnessgym.api.trainer.entity;

import com.fitnessgym.api.common.audit.BaseAuditEntity;
import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "TRAINER",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_trainer_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer extends BaseAuditEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "trainer_seq"
    )
    @SequenceGenerator(
            name = "trainer_seq",
            sequenceName = "SEQ_TRAINER",
            allocationSize = 1
    )
    @Column(name = "trainer_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_trainer_user")
    )
    private User user;

    @Column(
            name = "first_name",
            nullable = false,
            length = 100
    )
    private String firstName;

    @Column(
            name = "last_name",
            nullable = false,
            length = 100
    )
    private String lastName;

    @Column(
            name = "phone",
            nullable = false,
            length = 20
    )
    private String phone;

    @Column(
            name = "specialization",
            nullable = false,
            length = 150
    )
    private String specialization;

    @Column(
            name = "experience_years",
            nullable = false
    )
    private Integer experienceYears;

    @Lob
    @Column(name = "bio")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "approval_status",
            nullable = false,
            length = 30
    )
    private ApprovalStatus approvalStatus;
}