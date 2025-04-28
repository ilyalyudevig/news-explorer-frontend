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
}) {
  const { values, setValues, handleChange } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (modalIsOpen) {
      setValues(() => ({
        email: "",
        password: "",
      }));
    }
  }, [modalIsOpen, setValues]);

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
    >
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
        value={values.email}
        onChange={handleChange}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
        required={true}
        ariaLabel="Password"
        errorClass="url-input-error"
        value={values.password}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}
export default LoginModal;
