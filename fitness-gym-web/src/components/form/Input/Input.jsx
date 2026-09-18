import "./Input.css";

function Input({
    id,
    name,
    type = "text",
    value,
    defaultValue,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    autoComplete,
    onChange,
    onBlur,
    className = "",
    ...props
}) {
    const inputClasses = [
        "input",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClasses}
            {...props}
        />
    );
}

export default Input;