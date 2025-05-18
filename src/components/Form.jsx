function Form({ formName, onSubmit, children, ariaLabelledby }) {
  return (
    <form
      className="modal__form form"
      name={`${formName}-form`}
      onSubmit={onSubmit}
      role="form"
      aria-labelledby={ariaLabelledby}
    >
      <fieldset className="form__fieldset">{children}</fieldset>
    </form>
  );
}
export default Form;
