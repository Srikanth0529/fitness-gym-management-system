package com.fitnessgym.api.user.repository;

import com.fitnessgym.api.common.enums.RoleName;
import com.fitnessgym.api.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface RoleRepository extends JpaRepository<Role,Long>
{
    Optional<Role> findByRoleName(RoleName roleName);
}