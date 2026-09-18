import "./Textarea.css";

function Textarea({
    id,
    name,
    value,
    defaultValue,
    placeholder,
    rows = 4,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    onBlur,
    className = "",
    ...props
}) {
    return (
        <textarea
            id={id}
            name={name}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            className={`textarea ${className}`.trim()}
            {...props}
        />
    );
}

export default Textarea;