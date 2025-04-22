import Button from "./Button";

function SearchForm() {
  return (
    <form className="header__search-form form">
      <div className="form__container">
        <input className="form__input" type="search" />
        <Button className="form__button" buttonText="Search" type="submit" />
      </div>
    </form>
  );
}
export default SearchForm;
