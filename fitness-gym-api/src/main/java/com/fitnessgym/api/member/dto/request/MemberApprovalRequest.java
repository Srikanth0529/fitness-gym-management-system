package com.fitnessgym.api.member.dto.request;

import com.fitnessgym.api.common.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberApprovalRequest {

    @NotNull(message = "Approval status is required")
    private ApprovalStatus approvalStatus;
}