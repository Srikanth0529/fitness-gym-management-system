package com.fitnessgym.api.common.response;

import java.time.LocalDateTime;
import java.util.Map;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String errorCode;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> errors;

    public ApiResponse() {
    }

    public ApiResponse(
            boolean success,
            String message,
            T data
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public static <T> ApiResponse<T> success(
            String message,
            T data
    ) {
        return new ApiResponse<>(
                true,
                message,
                data
        );
    }

    public static <T> ApiResponse<T> success(
            String message
    ) {
        return new ApiResponse<>(
                true,
                message,
                null
        );
    }

    public static <T> ApiResponse<T> error(
            String message
    ) {
        return new ApiResponse<>(
                false,
                message,
                null
        );
    }
public void setErrorCode(String errorCode) {
    this.errorCode = errorCode;
}

public void setPath(String path) {
    this.path = path;
}

public void setErrors(Map<String, String> errors) {
    this.errors = errors;
}
}