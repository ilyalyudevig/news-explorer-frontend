import Modal from "./Modal";
import Form from "./Form";
import Button from "./Button";

function ModalWithForm({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  buttonText,
  switchBtnHandler,
  switchBtnText,
  onSubmit,
  submitDisabled,
  children,
  dataTestId,
}) {
  return (
    <Modal
      title={title}
      name={name}
      activeModal={activeModal}
      modalIsOpen={modalIsOpen}
      handleModalClose={handleModalClose}
      dataTestId={dataTestId}
    >
      <Form
        onSubmit={onSubmit}
        formName={name}
        ariaLabelledby={`modal-title-${name}`}
      >
        {children}
        <Button
          buttonText={buttonText}
          type="submit"
          className="form__button form__button--main"
          disabled={submitDisabled}
          dataTestId="form-submit-button"
        />
        <div className="form__second-btn-container">
          <p className="form__paragraph">or&nbsp;</p>
          <Button
            buttonText={switchBtnText}
            type="button"
            className="form__button form__button--second"
            onClick={switchBtnHandler}
          />
        </div>
      </Form>
    </Modal>
  );
}
export default ModalWithForm;
