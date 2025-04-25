import Modal from "./Modal";
import Form from "./Form";
import Button from "./Button";

function ModalWithForm({ title, children }) {
  return (
    <Modal title={title}>
      <Form>
        {children}
        <Button
          buttonText="Sign in"
          type="submit"
          className="form__button--signin"
        />
        <div className="form__second-btn-container">
          <p className="form__paragraph">or&nbsp;</p>
          <Button
            buttonText="Sign up"
            type="button"
            className="form_button--signup"
          />
        </div>
      </Form>
    </Modal>
  );
}
export default ModalWithForm;
