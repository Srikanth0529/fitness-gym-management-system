package com.fitnessgym.api.classmanagement.repository;

import com.fitnessgym.api.classmanagement.entity.ClassOccurrence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassOccurrenceRepository
        extends JpaRepository<ClassOccurrence, Long> {

    List<ClassOccurrence> findByGymClass_ClassIdOrderByStartTimeAsc(
            Long classId
    );
}