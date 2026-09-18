package com.fitnessgym.api.user.entity;

import com.fitnessgym.api.common.audit.BaseAuditEntity;
import com.fitnessgym.api.common.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "APP_USER",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_email",
                        columnNames = "email"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseAuditEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "app_user_seq"
    )
    @SequenceGenerator(
            name = "app_user_seq",
            sequenceName = "SEQ_APP_USER",
            allocationSize = 1
    )
    @Column(name = "user_id")
    private Long id;

    @Column(
            name = "email",
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @Column(
            name = "password_hash",
            nullable = false,
            length = 255
    )
    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "role_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_role")
    )
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "account_status",
            nullable = false,
            length = 30
    )
    private AccountStatus accountStatus;
}