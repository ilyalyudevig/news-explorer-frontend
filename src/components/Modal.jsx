function Modal({ title, children }) {
  return (
    <div className="modal">
      <div className="modal__container">
        <button
          className="modal__close-button"
          type="button"
          aria-label="close"
        />
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
export default Modal;
