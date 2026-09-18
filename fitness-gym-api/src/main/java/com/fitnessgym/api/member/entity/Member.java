package com.fitnessgym.api.member.entity;

import com.fitnessgym.api.common.audit.BaseAuditEntity;
import com.fitnessgym.api.common.enums.ApprovalStatus;
import com.fitnessgym.api.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "MEMBER",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_member_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends BaseAuditEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "member_seq"
    )
    @SequenceGenerator(
            name = "member_seq",
            sequenceName = "SEQ_MEMBER",
            allocationSize = 1
    )
    @Column(name = "member_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_member_user")
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
            length = 20
    )
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(
            name = "gender",
            length = 20
    )
    private String gender;

    @Column(
            name = "address",
            length = 500
    )
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "approval_status",
            nullable = false,
            length = 30
    )
    private ApprovalStatus approvalStatus;

    @Column(name = "join_date")
    private LocalDate joinDate;
}