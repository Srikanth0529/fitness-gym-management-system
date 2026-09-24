package com.fitnessgym.api.classmanagement.repository;

import com.fitnessgym.api.classmanagement.entity.GymClass;
import com.fitnessgym.api.common.enums.ClassStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GymClassRepository
        extends JpaRepository<GymClass, Long> {

    List<GymClass> findByClassStatus(ClassStatus classStatus);

    List<GymClass> findByTrainerId(Long trainerId);

    List<GymClass> findByTrainerIdAndClassStatus(
            Long trainerId,
            ClassStatus classStatus
    );
}