package com.fitnessgym.api.config;

import com.fitnessgym.api.common.enums.AccountStatus;
import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.user.entity.Role;
import com.fitnessgym.api.user.entity.User;
import com.fitnessgym.api.user.repository.RoleRepository;
import com.fitnessgym.api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeRoles() {

        return args -> {

            createRoleIfNotExists(
                    RoleName.MEMBER,
                    "Gym member"
            );

            createRoleIfNotExists(
                    RoleName.TRAINER,
                    "Gym trainer"
            );

            createRoleIfNotExists(
                    RoleName.ADMIN,
                    "System administrator"
            );

            createAdminIfNotExists();
        };
    }

    private void createRoleIfNotExists(
            RoleName roleName,
            String description
    ) {

        if (roleRepository.findByRoleName(roleName).isEmpty()) {

            Role role = Role.builder()
                    .roleName(roleName)
                    .description(description)
                    .build();

            roleRepository.save(role);
        }
    }

    private void createAdminIfNotExists() {

        String adminEmail = "admin@gym.com";

        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return;
        }

        Role adminRole = roleRepository
                .findByRoleName(RoleName.ADMIN)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "ADMIN role not configured"
                        )
                );

        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(
                        passwordEncoder.encode("Admin@12345")
                )
                .role(adminRole)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userRepository.save(admin);
    }
}