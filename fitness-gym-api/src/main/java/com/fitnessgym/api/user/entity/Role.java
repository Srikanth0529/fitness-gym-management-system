package com.fitnessgym.api.user.entity;

import com.fitnessgym.api.common.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "GYM_ROLE",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_role_name",
                        columnNames = "role_name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
@GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "gym_role_seq"
)
@SequenceGenerator(
        name = "gym_role_seq",
        sequenceName = "SEQ_GYM_ROLE",
        allocationSize = 1
)
@Column(name = "role_id")
private Long id;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "role_name",
            nullable = false,
            length = 30
    )
    private RoleName roleName;

    @Column(
            name = "description",
            length = 255
    )
    private String description;
}