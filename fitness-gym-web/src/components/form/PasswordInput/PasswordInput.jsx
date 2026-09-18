import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import "./PasswordInput.css";

function PasswordInput({
    id,
    name,
    value,
    defaultValue,
    placeholder = "Enter password",
    disabled = false,
    required = false,
    autoComplete = "current-password",
    onChange,
    onBlur,
    className = "",
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`password-input ${className}`.trim()}>
            <input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                onChange={onChange}
                onBlur={onBlur}
                className="password-input__field"
                {...props}
            />

            <button
                type="button"
                className="password-input__toggle"
                onClick={() =>
                    setShowPassword((current) => !current)
                }
                disabled={disabled}
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
            >
                {showPassword ? (
                    <EyeOff size={19} />
                ) : (
                    <Eye size={19} />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;