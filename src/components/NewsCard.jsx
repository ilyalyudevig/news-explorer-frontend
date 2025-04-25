import cardImg from "../images/card_image-min.jpg";
import Button from "./Button";

function NewsCard() {
  return (
    <article className="card">
      <Button
        className="card__save-button"
        onClick={() => console.log("clicked")}
      />
      <img className="card__image" src={cardImg} />
      <div className="card__content">
        <p className="card__date">November 4, 2020</p>
        <h3 className="card__title">
          Everyone Needs a Special 'Sit&nbsp;Spot' in Nature
        </h3>
        <p className="card__paragraph">
          Ever since I read Richard Louv's influential book, "Last Child in the
          Woods," the idea of having a special "sit spot" has stuck with me.
          This advice, which Louv attributes to nature educator Jon Young, is
          for both adults and children to find...
        </p>
        <h4 className="card__source">treehugger</h4>
      </div>
    </article>
  );
}
export default NewsCard;
