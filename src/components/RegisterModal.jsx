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
  dataTestId,
}) {
  const { values, setValues, handleChange, errors, setErrors, getInputRef } =
    useForm({
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

      setErrors(() => ({
        registerEmail: "",
        registerPassword: "",
        username: "",
      }));
    }
  }, [modalIsOpen, setValues, setErrors]);

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
      submitDisabled={
        errors.registerEmail || errors.registerPassword || errors.username
      }
      dataTestId={dataTestId}
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
        aria-describedby={
          errors.registerEmail ? "register-email-error" : undefined
        }
        dataTestId="registerEmail-input"
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
        aria-describedby={
          errors.registerPassword ? "register-password-error" : undefined
        }
        dataTestId="registerPassword-input"
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
            ? "form__api-error"
            : ""
        }
        errorMessage={
          apiError ? "This email is not available" : errors.username
        }
        aria-describedby={
          errors.username || apiError ? "register-username-error" : undefined
        }
        dataTestId="username-input"
      />
    </ModalWithForm>
  );
}
export default RegisterModal;
