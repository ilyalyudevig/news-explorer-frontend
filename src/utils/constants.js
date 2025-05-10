const newsApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://nomoreparties.co/news/v2/everything"
    : "https://newsapi.org/v2/everything";

const backendBaseUrl =
  process.env.NODE_ENV === "production"
    ? "" // TODO
    : "http://localhost:3001";

export { newsApiBaseUrl, backendBaseUrl };
