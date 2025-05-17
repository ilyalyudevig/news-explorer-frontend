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
  apiError,
}) {
  const { values, setValues, handleChange, errors, getInputRef } = useForm({
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
        minLength={5}
        maxLength={254}
        required={true}
        ariaLabel="Email"
        value={values.registerEmail}
        onChange={handleChange}
        inputRef={getInputRef("registerEmail")}
        errorClass={errors.registerEmail ? "form__input-error_active" : ""}
        errorMessage={errors.registerEmail}
      />
      <Input
        label="Password"
        type="password"
        name="registerPassword"
        placeholder="Enter password"
        minLength={8}
        maxLength={72}
        required={true}
        ariaLabel="Password"
        value={values.registerPassword}
        onChange={handleChange}
        inputRef={getInputRef("registerPassword")}
        errorClass={errors.registerPassword ? "form__input-error_active" : ""}
        errorMessage={errors.registerPassword}
      />
      <Input
        label="Username"
        type="text"
        name="username"
        placeholder="Enter your username"
        minLength={2}
        maxLength={30}
        required={true}
        ariaLabel="Username"
        value={values.username}
        onChange={handleChange}
        inputRef={getInputRef("username")}
        errorClass={
          errors.username
            ? "form__input-error_active"
            : apiError
            ? "form__registration-error"
            : ""
        }
        errorMessage={
          apiError ? "This email is not available" : errors.username
        }
      />
    </ModalWithForm>
  );
}
export default RegisterModal;
