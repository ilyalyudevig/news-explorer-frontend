import notFoundIcon from "../images/not-found-icon.svg";

function NothingFound() {
  return (
    <section className="not-found">
      <div className="not-found__container">
        <img className="not-found__image" src={notFoundIcon} />
        <h1 className="not-found__title">Nothing found</h1>
        <p className="not-found__text">
          "Sorry, but nothing matched your&nbsp;search&nbsp;terms."
        </p>
      </div>
    </section>
  );
}
export default NothingFound;
