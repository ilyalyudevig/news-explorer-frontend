function Form({ formName, children }) {
  return (
    <form className="modal__form form" name={`${formName}-form`}>
      <fieldset className="form__fieldset">{children}</fieldset>
    </form>
  );
}
export default Form;
