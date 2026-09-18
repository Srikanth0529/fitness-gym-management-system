import "./Select.css";

function Select({
    id,
    name,
    value,
    defaultValue,
    options = [],
    placeholder = "Select an option",
    disabled = false,
    required = false,
    onChange,
    onBlur,
    className = "",
    ...props
}) {
    return (
        <select
            id={id}
            name={name}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            className={`select ${className}`.trim()}
            {...props}
        >
            <option value="">
                {placeholder}
            </option>

            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default Select;