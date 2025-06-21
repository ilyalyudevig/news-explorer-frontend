const newsApiBaseUrl =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
    ? "https://nomoreparties.co/news/v2/everything"
    : "https://newsapi.org/v2/everything";

const backendBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.news-explorer.info"
    : process.env.NODE_ENV === "staging"
    ? "https://staging-api.news-explorer.info"
    : "http://localhost:3001";

export { newsApiBaseUrl, backendBaseUrl };
