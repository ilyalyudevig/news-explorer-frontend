import { useModalClose } from "../hooks/useModalClose";
import { useFocusTrap } from "../hooks/useFocusTrap";

function Modal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  children,
  dataTestId,
}) {
  const isModalActive = name === activeModal && modalIsOpen;
  const focusTrapRef = useFocusTrap(isModalActive);

  useModalClose(modalIsOpen, handleModalClose);

  return (
    <div
      className={`modal modal_type_${name} ${
        name === activeModal ? "modal_open" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${name}`}
      data-testid={dataTestId}
    >
      <div className="modal__container" ref={focusTrapRef}>
        <button
          className="modal__close-button"
          type="button"
          aria-label="Close modal"
          onClick={handleModalClose}
        />
        <h2 className="modal__title" id={`modal-title-${name}`}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
export default Modal;
