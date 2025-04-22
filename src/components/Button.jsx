function Button({ buttonText, type, onClick, disabled, className }) {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
}

export default Button;
