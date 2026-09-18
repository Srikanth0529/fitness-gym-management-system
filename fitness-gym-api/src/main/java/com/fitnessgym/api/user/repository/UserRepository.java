package com.fitnessgym.api.user.repository;

import com.fitnessgym.api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.email = :email")
    long countByEmail(@Param("email") String email);
}