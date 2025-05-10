import Button from "./Button";
import Modal from "./Modal";

function SuccessModal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  buttonText,
  handleLogin,
}) {
  return (
    <Modal
      title={title}
      name={name}
      activeModal={activeModal}
      modalIsOpen={modalIsOpen}
      handleModalClose={handleModalClose}
    >
      <Button
        buttonText={buttonText}
        className="modal__button modal__button--signin"
        onClick={handleLogin}
      />
    </Modal>
  );
}
export default SuccessModal;
