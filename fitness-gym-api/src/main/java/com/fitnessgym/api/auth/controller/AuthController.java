package com.fitnessgym.api.auth.controller;

import com.fitnessgym.api.auth.dto.request.LoginRequest;
import com.fitnessgym.api.auth.dto.request.RegisterRequest;
import com.fitnessgym.api.auth.dto.response.LoginResponse;
import com.fitnessgym.api.auth.service.AuthService;
import com.fitnessgym.api.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Registration successful"
                        )
                );
    }

    @PostMapping("/login")
public ResponseEntity<ApiResponse<LoginResponse>> login(
        @Valid @RequestBody LoginRequest request
) {
    LoginResponse response = authService.login(request);

    return ResponseEntity.ok(
            ApiResponse.success(
                    "Login successful",
                    response
            )
    );
}
}