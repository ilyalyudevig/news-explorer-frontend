import Button from "./Button";

import { formatDisplayDate } from "../utils/formatDate";
import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

function NewsCard({
  source,
  title,
  publishedAt,
  content,
  urlToImage,
  url,
  handleSaveArticle,
  handleDeleteArticle,
  isSaved,
  cardType,
  keywords,
}) {
  const displayDate = formatDisplayDate(publishedAt);
  const { isLoggedIn } = useCurrentUser();
  const [isHovered, setIsHovered] = useState(false);

  const onButtonClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      return;
    }
    if (isSaved) {
      handleDeleteArticle(url);
    } else {
      handleSaveArticle({
        source,
        title,
        publishedAt,
        content,
        urlToImage,
        url,
        keywords,
      });
    }
  };

  let buttonClassName = "card__save-button";
  let tooltipText = "";

  if (isHovered) {
    if (!isLoggedIn && !isSaved) {
      tooltipText = "Sign in to save articles";
    } else if (isLoggedIn && isSaved) {
      tooltipText = "Remove from saved";
    }
  }

  if (isSaved && cardType === "saved") {
    buttonClassName += " card__save-button--delete";
  } else if (isSaved && cardType === "search-result") {
    buttonClassName += " card__save-button--checked";
  }

  return (
    <article className="card" aria-label={title} data-testid="news-card">
      {cardType === "saved" && keywords && (
        <div className="card__keywords">{keywords[0]}</div>
      )}
      {tooltipText && <div className="card__tooltip">{tooltipText}</div>}
      <Button
        className={buttonClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onButtonClick}
        aria-label={isSaved ? "Remove from saved" : "Save article"}
        dataTestId={isSaved ? "delete-button" : "save-button"}
      />
      <img className="card__image" src={urlToImage} alt={title} />
      <div className="card__content">
        <p className="card__date">{displayDate}</p>
        <h3 className="card__title" data-testid="card-title">
          {title}
        </h3>
        <p className="card__paragraph">{content}</p>
        <h4 className="card__source">{source.name}</h4>
      </div>
    </article>
  );
}
export default NewsCard;
