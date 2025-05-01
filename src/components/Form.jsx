function Form({ formName, onSubmit, children }) {
  return (
    <form
      className="modal__form form"
      name={`${formName}-form`}
      onSubmit={onSubmit}
    >
      <fieldset className="form__fieldset">{children}</fieldset>
    </form>
  );
}
export default Form;
