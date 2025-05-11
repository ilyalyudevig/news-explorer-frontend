import { backendBaseUrl as baseUrl } from "./constants";

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getSavedArticles() {
    return new Promise((resolve, reject) =>
      resolve([
        {
          source: {
            id: "wired",
            name: "Wired",
          },
          author: "Kate Knibbs",
          title:
            "Trump’s Tariffs Are Threatening America’s Apple Juice Supply Chain",
          description:
            "Most of the apple juice Americans drink is imported, with a large share coming from China. Experts say families should expect to start paying higher prices for the beloved beverage.",
          url: "https://www.wired.com/story/apple-juice-shortage-tariffs/",
          urlToImage:
            "https://media.wired.com/photos/6812934a8f16f415836a2072/191:100/w_1280,c_limit/Apple-Juice-Shortage-Business-2211147875.jpg",
          publishedAt: "2025-05-06T11:00:00Z",
          content:
            "Few foods are more American than apple pie, but the truth is, some of the countrys favorite apple products arent actually made in the United States. Apple juice, a perennial lunchroom staple, is a pr… [+2760 chars]",
          keywords: ["Apple"],
        },
        {
          source: {
            id: "the-verge",
            name: "The Verge",
          },
          author: "Dominic Preston",
          title: "Apple approves Spotify app update with external payments",
          description:
            "Apple has approved an update to Spotify’s iPhone app that makes it the first major app to support direct links for US users to pay for plans on an external site, without restrictions. Apple has been forced to change its rules on external payments following an…",
          url: "https://www.theverge.com/news/660084/spotify-app-iphone-apple-update-external-payment-links",
          urlToImage:
            "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25378905/STK088_SPOTIFY_CVIRGINIA_A.jpg?quality=90&strip=all&crop=0%2C10.732984293194%2C100%2C78.534031413613&w=1200",
          publishedAt: "2025-05-02T12:11:20Z",
          content:
            "Following the update, Spotify can freely advertise prices to US users if they subscribe outside the app.\r\nFollowing the update, Spotify can freely advertise prices to US users if they subscribe outsi… [+1054 chars]",
          keywords: ["Apple"],
        },
      ])
    );
  }

  saveArticle(article) {
    return new Promise((resolve, reject) => {
      resolve({
        source: {
          id: "the-verge",
          name: "The Verge",
        },
        author: "David Pierce",
        title: "How Apple lost control of the App Store",
        description:
          "\"Cook chose poorly\" is one of those phrases you'll someday read in a history book about the tech industry. That's just one of the memorable lines from Judge Yvonne Gonzalez Rogers' stinging rebuke of Apple this week, in which she ruled that Apple needed to ch…",
        url: "https://www.theverge.com/the-vergecast/660098/apple-app-store-payment-rules-epic-meta-google-vergecast",
        urlToImage:
          "https://platform.theverge.com/wp-content/uploads/sites/2/2025/05/VST_0501_Site.jpg?quality=90&strip=all&crop=0%2C10.732984293194%2C100%2C78.534031413613&w=1200",
        publishedAt: "2025-05-02T12:42:08Z",
        content:
          "On The Vergecast: Monopoly Madness! Heres whats coming for Apple, Google, and Meta in court.\r\nOn The Vergecast: Monopoly Madness! Heres whats coming for Apple, Google, and Meta in court.\r\nCook chose … [+1922 chars]",
        keywords: ["Apple"],
      });
    });
  }
}

export const api = new Api({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
