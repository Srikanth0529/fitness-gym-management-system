package com.fitnessgym.api.classmanagement.entity;

import com.fitnessgym.api.common.enums.ClassStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CLASS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymClass {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "class_seq"
    )
    @SequenceGenerator(
            name = "class_seq",
            sequenceName = "CLASS_SEQ",
            allocationSize = 1
    )
    @Column(name = "CLASS_ID")
    private Long classId;

    @Column(
            name = "CLASS_NAME",
            nullable = false,
            length = 150
    )
    private String className;

    @Column(
            name = "DESCRIPTION",
            length = 500
    )
    private String description;

    @Column(
            name = "TRAINER_ID",
            nullable = false
    )
    private Long trainerId;

    @Column(
            name = "DEFAULT_CAPACITY",
            nullable = false
    )
    private Integer defaultCapacity;

    @Column(
            name = "LOCATION",
            length = 150
    )
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "CLASS_STATUS",
            nullable = false,
            length = 30
    )
    private ClassStatus classStatus;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}