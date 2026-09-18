import "./FormField.css";

function FormField({
    label,
    htmlFor,
    required = false,
    error,
    hint,
    children,
}) {
    return (
        <div className="form-field">
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="form-field__label"
                >
                    {label}

                    {required && (
                        <span
                            className="form-field__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}

            {children}

            {error && (
                <p
                    className="form-field__error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {!error && hint && (
                <p className="form-field__hint">
                    {hint}
                </p>
            )}
        </div>
    );
}

export default FormField;