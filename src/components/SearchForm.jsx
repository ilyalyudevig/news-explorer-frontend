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
    <form
      className="header__search-form search-form"
      onSubmit={handleSubmit}
      name="search-form"
      role="search"
      aria-label="Search form"
    >
      <div className="search-form__container">
        <label htmlFor="search-input" className="search-form__label">
          Search for news
        </label>
        <input
          className="search-form__input"
          type="search"
          id="search-input"
          name="query"
          value={values.query}
          onChange={handleChange}
          minLength={1}
          placeholder={errors.query}
          ref={getInputRef("query")}
          required
          aria-label="Search for news"
          data-testid="search-input"
        />
        <Button
          className="search-form__button"
          buttonText="Search"
          type="submit"
          aria-label="Search"
          dataTestId="search-button"
        />
      </div>
    </form>
  );
}
export default SearchForm;
