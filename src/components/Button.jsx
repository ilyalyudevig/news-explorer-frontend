function Button({ buttonText, type, onClick, disabled, className, children }) {
  return (
    <button
      type={type}
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
      {children}
    </button>
  );
}

export default Button;
