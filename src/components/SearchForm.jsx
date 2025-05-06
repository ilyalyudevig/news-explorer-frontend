import { useForm } from "../hooks/useForm";
import Button from "./Button";

function SearchForm({ onSearch }) {
  const { values, setValues, handleChange, errors, getInputRef } = useForm({
    query: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(values.query);
    setValues({ query: "" });
  };

  return (
    <form className="header__search-form search-form" onSubmit={handleSubmit}>
      <div className="search-form__container">
        <input
          className="search-form__input"
          type="search"
          name="query"
          value={values.query}
          onChange={handleChange}
          minLength={1}
          placeholder={errors.query}
          ref={getInputRef("query")}
          required
        />
        <Button
          className="search-form__button"
          buttonText="Search"
          type="submit"
        />
      </div>
    </form>
  );
}
export default SearchForm;
