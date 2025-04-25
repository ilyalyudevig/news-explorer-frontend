import ModalWithForm from "./ModalWithForm";
import Input from "./Input";

function LoginModal({ title }) {
  return (
    <ModalWithForm title={title}>
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter email"
        minLength="1"
        maxLength="30"
        required={true}
        ariaLabel="Email"
        errorClass="title-input-error"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
        required={true}
        ariaLabel="Password"
        errorClass="url-input-error"
      />
    </ModalWithForm>
  );
}
export default LoginModal;
