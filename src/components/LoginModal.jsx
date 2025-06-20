import ModalWithForm from "./ModalWithForm";
import Input from "./Input";
import { useForm } from "../hooks/useForm";
import { useEffect } from "react";

function LoginModal({
  title,
  name,
  activeModal,
  modalIsOpen,
  handleModalClose,
  buttonText,
  switchBtnHandler,
  switchBtnText,
  handleLogin,
  apiError,
}) {
  const { values, setValues, handleChange, errors, setErrors, getInputRef } =
    useForm({
      email: "",
      password: "",
    });

  useEffect(() => {
    if (modalIsOpen) {
      setValues(() => ({
        email: "",
        password: "",
      }));

      setErrors(() => ({
        email: "",
        password: "",
      }));
    }
  }, [modalIsOpen, setValues, setErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(values);
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
      submitDisabled={errors.email || errors.password}
      dataTestId="sign-in-modal"
    >
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter email"
        minLength={5}
        maxLength={254}
        required={true}
        ariaLabel="Email"
        value={values.email}
        onChange={handleChange}
        inputRef={getInputRef("email")}
        errorClass={errors.email ? "form__input-error_active" : ""}
        errorMessage={errors.email}
        dataTestId="email-input"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
        minLength={8}
        maxLength={72}
        required={true}
        ariaLabel="Password"
        value={values.password}
        onChange={handleChange}
        inputRef={getInputRef("password")}
        errorClass={
          errors.password
            ? "form__input-error_active"
            : apiError
            ? "form__api-error"
            : ""
        }
        errorMessage={apiError ? apiError.message : errors.password}
        dataTestId="password-input"
      />
    </ModalWithForm>
  );
}
export default LoginModal;
