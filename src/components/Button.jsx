function Button({
  buttonText,
  type,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  className,
  children,
}) {
  return (
    <button
      type={type}
      className={`${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
      {children}
    </button>
  );
}

export default Button;
