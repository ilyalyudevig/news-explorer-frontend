import ModalWithForm from "./ModalWithForm";
import Input from "./Input";
import { useForm } from "../hooks/useForm";
import { useEffect } from "react";

function RegisterModal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  buttonText,
  switchBtnHandler,
  switchBtnText,
  handleRegister,
}) {
  const { values, setValues, handleChange } = useForm({
    registerEmail: "",
    registerPassword: "",
    username: "",
  });

  useEffect(() => {
    if (modalIsOpen) {
      setValues(() => ({
        registerEmail: "",
        registerPassword: "",
        username: "",
      }));
    }
  }, [modalIsOpen, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(values);
  };

  return (
    <ModalWithForm
      title={title}
      name={name}
      activeModal={activeModal}
      modalIsOpen={modalIsOpen}
      handleModalClose={handleModalClose}
      buttonText={buttonText}
      switchBtnHandler={switchBtnHandler}
      switchBtnText={switchBtnText}
      onSubmit={handleSubmit}
    >
      <Input
        label="Email"
        type="email"
        name="registerEmail"
        placeholder="Enter email"
        minLength="1"
        maxLength="30"
        required={true}
        ariaLabel="Email"
        errorClass="email-input-error"
        value={values.registerEmail}
        onChange={handleChange}
      />
      <Input
        label="Password"
        type="password"
        name="registerPassword"
        placeholder="Enter password"
        required={true}
        ariaLabel="Password"
        errorClass="password-input-error"
        value={values.registerPassword}
        onChange={handleChange}
      />
      <Input
        label="Username"
        type="text"
        name="username"
        placeholder="Enter your username"
        required={true}
        ariaLabel="Username"
        errorClass="username-input-error"
        value={values.username}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}
export default RegisterModal;
