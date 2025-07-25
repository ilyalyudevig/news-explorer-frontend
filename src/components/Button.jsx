function Button({
  buttonText,
  type,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  className,
  children,
  dataTestId,
  ariaLabel,
  ariaExpanded,
  role,
}) {
  return (
    <button
      type={type}
      className={`${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      role={role}
    >
      {buttonText}
      {children}
    </button>
  );
}

export default Button;
