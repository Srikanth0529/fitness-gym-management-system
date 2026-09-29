package com.fitnessgym.api.classmanagement.repository;

import com.fitnessgym.api.classmanagement.entity.ClassOccurrence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassOccurrenceRepository
        extends JpaRepository<ClassOccurrence, Long> {
}