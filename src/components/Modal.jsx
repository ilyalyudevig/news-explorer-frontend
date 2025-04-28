import { useModalClose } from "../hooks/useModalClose";

function Modal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  children,
}) {
  useModalClose(modalIsOpen, handleModalClose);

  return (
    <div
      className={`modal modal_type_${name} ${
        name === activeModal ? "modal_open" : ""
      }`}
    >
      <div className="modal__container">
        <button
          className="modal__close-button"
          type="button"
          aria-label="close"
          onClick={handleModalClose}
        />
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
export default Modal;
