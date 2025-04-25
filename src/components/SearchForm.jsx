import Button from "./Button";

function SearchForm() {
  return (
    <form className="header__search-form search-form">
      <div className="search-form__container">
        <input className="search-form__input" type="search" />
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
