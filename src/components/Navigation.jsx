import Button from "./Button";

function Navigation({ handleSignInModalOpen }) {
  return (
    <nav className="header__nav nav">
      <h1 className="nav__title">NewsExplorer</h1>
      <ul className="nav__items">
        <li className="nav__item">
          <a className="nav__nav-link">Home</a>
        </li>
        <li className="nav__item">
          <Button
            buttonText="Sign in"
            className="nav__button--signin"
            onClick={handleSignInModalOpen}
          />
        </li>
      </ul>
    </nav>
  );
}
export default Navigation;
