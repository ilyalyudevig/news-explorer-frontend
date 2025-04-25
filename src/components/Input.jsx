function Input({
  label,
  type,
  name,
  placeholder,
  minLength,
  maxLength,
  required,
  ariaLabel,
  errorClass,
}) {
  return (
    <>
      <label className="form__label" htmlFor={name}>
        {label}
      </label>
      <input
        className="form__input"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        aria-label={ariaLabel}
      />
      <div className="form__input-error-container">
        <p className={`form__input-error ${errorClass}`}></p>
      </div>
    </>
  );
}
export default Input;
