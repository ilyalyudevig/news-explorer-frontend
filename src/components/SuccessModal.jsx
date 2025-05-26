import Button from "./Button";
import Modal from "./Modal";

function SuccessModal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  buttonText,
  handleModalOpen,
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
        onClick={handleModalOpen}
      />
    </Modal>
  );
}
export default SuccessModal;
