package com.fitnessgym.api.classmanagement.service;

import com.fitnessgym.api.classmanagement.dto.request.CreateClassRequest;
import com.fitnessgym.api.classmanagement.dto.response.ClassResponse;
import com.fitnessgym.api.classmanagement.entity.GymClass;
import com.fitnessgym.api.classmanagement.mapper.GymClassMapper;
import com.fitnessgym.api.classmanagement.repository.GymClassRepository;
import com.fitnessgym.api.common.enums.ClassStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassService {

    private final GymClassRepository gymClassRepository;
    private final GymClassMapper gymClassMapper;

    public ClassResponse createClass(CreateClassRequest request) {

        GymClass gymClass =
                gymClassMapper.toEntity(request);

        gymClass.setClassStatus(ClassStatus.ACTIVE);

        GymClass savedClass =
                gymClassRepository.save(gymClass);

        return gymClassMapper.toResponse(savedClass);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> getClasses(
            ClassStatus status,
            Long trainerId
    ) {

        List<GymClass> classes;

        if (status != null && trainerId != null) {

            classes =
                    gymClassRepository
                            .findByTrainerIdAndClassStatus(
                                    trainerId,
                                    status
                            );

        } else if (status != null) {

            classes =
                    gymClassRepository
                            .findByClassStatus(status);

        } else if (trainerId != null) {

            classes =
                    gymClassRepository
                            .findByTrainerId(trainerId);

        } else {

            classes =
                    gymClassRepository.findAll();
        }

        return classes.stream()
                .map(gymClassMapper::toResponse)
                .toList();
    }
}