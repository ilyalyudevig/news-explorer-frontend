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
    >
      {buttonText}
      {children}
    </button>
  );
}

export default Button;
