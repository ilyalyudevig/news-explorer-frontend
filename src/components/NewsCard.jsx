import Button from "./Button";

import { formatDisplayDate } from "../utils/formatDate";
import { useContext, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function NewsCard({ source, title, publishedAt, content, urlToImage }) {
  const displayDate = formatDisplayDate(publishedAt);
  const { isLoggedIn } = useContext(CurrentUserContext);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <article className="card">
      {!isLoggedIn && isHovered && (
        <div className="card__tooltip">Sign in to save articles</div>
      )}
      <Button
        className="card__save-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => console.log("TODO: Implement save article")}
      />
      <img className="card__image" src={urlToImage} />
      <div className="card__content">
        <p className="card__date">{displayDate}</p>
        <h3 className="card__title">{title}</h3>
        <p className="card__paragraph">{content}</p>
        <h4 className="card__source">{source.name}</h4>
      </div>
    </article>
  );
}
export default NewsCard;
