import { test, expect } from "@playwright/test";

test.describe("unauthorized user tests", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.removeItem("jwt");
    });

    await context.storageState({ path: "tests/states/no-token-state.json" });
    await context.close();
  });

  test.use({ storageState: "tests/states/no-token-state.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("sign in button is visible for an unauthorized user", async ({
    page,
  }) => {
    await page.getByTestId("nav-button-signin").isVisible();
  });

  test("saved articles link is not visible for an unauthorized user", async ({
    page,
  }) => {
    await page.getByTestId("nav-link-savednews").isHidden();
  });
});

test.describe("SearchResults component tests", () => {
  const mockArticles = [
    {
      source: { name: "Tech News" },
      title: "Breaking Tech Story 1",
      publishedAt: "2023-12-01T10:00:00Z",
      content: "First article content here...",
      urlToImage: "https://example.com/image1.jpg",
      url: "https://example.com/article1",
      keywords: "tech, innovation",
    },
    {
      source: { name: "Business Today" },
      title: "Business Update 2",
      publishedAt: "2023-12-02T15:30:00Z",
      content: "Second article content...",
      urlToImage: "https://example.com/image2.jpg",
      url: "https://example.com/article2",
      keywords: "business, finance",
    },
    {
      source: { name: "Science Daily" },
      title: "Science Discovery 3",
      publishedAt: "2023-12-03T09:15:00Z",
      content: "Third article content...",
      urlToImage: "https://example.com/image3.jpg",
      url: "https://example.com/article3",
      keywords: "science, research",
    },
    {
      source: { name: "Health News" },
      title: "Health Breakthrough 4",
      publishedAt: "2023-12-04T14:20:00Z",
      content: "Fourth article content...",
      urlToImage: "https://example.com/image4.jpg",
      url: "https://example.com/article4",
      keywords: "health, medical",
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.route("**/everything*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          totalResults: mockArticles.length,
          articles: mockArticles,
        }),
      });
    });

    await page.goto("http://localhost:3000/");
  });

  test("displays search results after performing a search", async ({
    page,
  }) => {
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();

    await expect(page.getByText("Search results")).toBeVisible();
    await expect(page.locator('[data-testid="news-card"]')).toHaveCount(3); // Initial visible count
  });

  test("shows only first 3 articles initially", async ({ page }) => {
    await page.getByTestId("search-input").fill("tech");
    await page.getByTestId("search-button").click();

    const cards = page.locator('[data-testid="news-card"]');
    await expect(cards).toHaveCount(3);
    await expect(page.getByText("Breaking Tech Story 1")).toBeVisible();
    await expect(page.getByText("Business Update 2")).toBeVisible();
    await expect(page.getByText("Science Discovery 3")).toBeVisible();
    await expect(page.getByText("Health Breakthrough 4")).not.toBeVisible();
  });

  test("shows 'Show more' button when more articles available", async ({
    page,
  }) => {
    await page.getByTestId("search-input").fill("news");
    await page.getByTestId("search-button").click();

    await expect(page.getByText("Show more")).toBeVisible();
  });

  test("hides 'Show more' button when all articles are visible", async ({
    page,
  }) => {
    await page.route("**/everything*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          totalResults: 2,
          articles: mockArticles.slice(0, 2),
        }),
      });
    });

    await page.goto("http://localhost:3000/");
    await page.getByTestId("search-input").fill("tech");
    await page.getByTestId("search-button").click();

    await expect(page.getByText("Show more")).not.toBeVisible();
  });

  test("loads more articles when 'Show more' is clicked", async ({ page }) => {
    await page.getByTestId("search-input").fill("news");
    await page.getByTestId("search-button").click();

    await expect(page.locator('[data-testid="news-card"]')).toHaveCount(3);

    await page.getByText("Show more").click();

    await expect(page.locator('[data-testid="news-card"]')).toHaveCount(4);
    await expect(page.getByText("Health Breakthrough 4")).toBeVisible();
    await expect(page.getByText("Show more")).not.toBeVisible();
  });

  test("displays article information correctly", async ({ page }) => {
    await page.getByTestId("search-input").fill("tech");
    await page.getByTestId("search-button").click();

    const firstCard = page.locator('[data-testid="news-card"]').first();

    await expect(firstCard.getByText("Breaking Tech Story 1")).toBeVisible();
    await expect(firstCard.getByText("Tech News")).toBeVisible();
    await expect(
      firstCard.getByText("First article content here...")
    ).toBeVisible();
    await expect(firstCard.locator("img")).toHaveAttribute(
      "src",
      "https://example.com/image1.jpg"
    );
  });

  test("shows tooltip for unauthenticated users on save button hover", async ({
    page,
  }) => {
    await page.getByTestId("search-input").fill("tech");
    await page.getByTestId("search-button").click();

    const saveButton = page.locator('[data-testid="save-button"]').first();
    await saveButton.hover();

    await expect(page.getByText("Sign in to save articles")).toBeVisible();
  });

  test("handles API error gracefully", async ({ page }) => {
    await page.route("**/everything*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Server error" }),
      });
    });

    await page.goto("http://localhost:3000/");
    await page.getByTestId("search-input").fill("tech");
    await page.getByTestId("search-button").click();

    await expect(page.getByTestId("api-error")).toBeVisible();
  });
});
