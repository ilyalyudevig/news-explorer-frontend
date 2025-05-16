import { backendBaseUrl as baseUrl } from "./constants";
import { checkResponse } from "./checkResponse";

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(url, options) {
    return fetch(url, options).then(checkResponse);
  }

  getSavedArticles() {
    return this._request(`${this._baseUrl}/articles`, {
      headers: this._headers,
    });
  }

  saveArticle(article, token) {
    return this._request(`${this._baseUrl}/articles`, {
      method: "POST",
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...article, source: article.source.name }),
    });
  }

  deleteArticle(articleId, token) {
    return this._request(`${this._baseUrl}/articles/${articleId}`, {
      method: "DELETE",
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    });
  }
}

export const api = new Api({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
