import { test, expect } from "@playwright/test";
import { loginUser, verifyAuthenticatedState } from "./helpers/auth-helpers";
import { resetUserState } from "./helpers/state-helpers";

test.describe.serial("Authenticated User Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await resetUserState(page);
    await loginUser(page);
  });

  test("should display authenticated navigation after login", async ({
    page,
  }) => {
    await verifyAuthenticatedState(page);
  });

  test("should handle article bookmarking and unbookmarking", async ({
    page,
  }) => {
    // Perform a search
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();
    await expect(page.getByRole("article")).toHaveCount(3);

    const firstArticle = page.getByRole("article").first();
    const firstArticleHeading = firstArticle.getByTestId("card-title");
    const firstArticleHeadingText = await firstArticleHeading.textContent();

    // 1. Bookmark the article
    const saveButton = firstArticle.getByTestId("save-button");
    await saveButton.click();

    // Verify the button icon changes to indicate it's saved
    await expect(firstArticle.getByTestId("delete-button")).toBeVisible();

    // 2. Verify the article appears in the "Saved articles" page
    await page.getByTestId("nav-link-savednews").click();
    await expect(page).toHaveURL(/.*\/saved-news$/);
    await expect(page.getByRole("article")).toHaveCount(1);
    const savedArticle = page.getByRole("article").first();
    const savedArticleHeadingText = await savedArticle
      .getByTestId("card-title")
      .textContent();
    expect(savedArticleHeadingText).toEqual(firstArticleHeadingText);

    // 3. Unbookmark the article from the "Saved articles" page
    await savedArticle.getByTestId("delete-button").click();

    // Verify the article is removed from the saved articles page
    await expect(page.getByRole("article")).toHaveCount(0);

    // 4. Navigate back to the main page and verify the article is unbookmarked
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();
    await expect(firstArticle.getByTestId("save-button")).toBeVisible();
  });

  test("should display and manage the saved articles page", async ({
    page,
  }) => {
    // Initially, the saved articles page should be empty
    await page.getByTestId("nav-link-savednews").click();
    await expect(page).toHaveURL(/.*\/saved-news$/);
    await expect(page.getByRole("article")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /you have 0 saved articles/ })
    ).toBeVisible();

    // Go back and save an article
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();
    await page.getByTestId("search-input").fill("Apple");
    await page.getByTestId("search-button").click();
    await expect(page.getByRole("article")).toHaveCount(3);

    const firstArticle = page.getByRole("article").first();
    await firstArticle.getByTestId("save-button").click();
    await expect(firstArticle.getByTestId("delete-button")).toBeVisible();

    // Navigate back to saved articles
    await page.getByTestId("nav-link-savednews").click();

    // Verify the page now shows 1 saved article
    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: /you have 1 saved article/ })
    ).toBeVisible();

    // Verify the keyword is displayed
    const keywordsSection = page.getByText("By keywords:");
    await expect(keywordsSection).toBeVisible();
    await expect(page.getByTestId("header-keywords")).toHaveText("Apple");

    // Remove the article
    const savedArticle = page.getByRole("article").first();
    await savedArticle.getByTestId("delete-button").click();

    // Verify the page is empty again
    await expect(page.getByRole("article")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /you have 0 saved articles/ })
    ).toBeVisible();
  });

  test("should maintain saved articles across navigation", async ({ page }) => {
    // Save an article
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();
    await expect(page.getByRole("article")).toHaveCount(3);
    const firstArticle = page.getByRole("article").first();
    await firstArticle.getByTestId("save-button").click();
    await expect(firstArticle.getByTestId("delete-button")).toBeVisible();

    // Navigate to saved articles and verify it's there
    await page.getByTestId("nav-link-savednews").click();
    await expect(page.getByRole("article")).toHaveCount(1);

    // Navigate back to home
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();
    await expect(page.getByRole("article").first()).toBeVisible();

    // Navigate back to saved articles and verify it's still there
    await page.getByTestId("nav-link-savednews").click();
    await expect(page.getByRole("article")).toHaveCount(1);
  });

  test("should handle user logout and protect routes", async ({ page }) => {
    // Verify we're currently authenticated
    await verifyAuthenticatedState(page);

    // Test logout functionality
    await page.getByTestId("nav-button-signout").click();

    // Verify we're returned to the unauthenticated state
    await expect(page.getByTestId("nav-button-signin")).toBeVisible();
    await expect(page.getByTestId("nav-link-savednews")).not.toBeVisible();
    await expect(page.getByTestId("nav-button-signout")).not.toBeVisible();

    // Verify we're on the home page
    await expect(page).toHaveURL("http://localhost:3000/");

    // Test accessing saved articles while unauthenticated
    await page.goto("http://localhost:3000/saved-news");

    // Should be redirected back to the home page
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(
      page.getByRole("heading", { name: "What's going on in the world?" })
    ).toBeVisible();
  });

  test("should preserve search state after bookmarking an article", async ({
    page,
  }) => {
    // Perform a search
    const searchTerm = "technology";
    await page.getByTestId("search-input").fill(searchTerm);
    await page.getByTestId("search-button").click();
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    const articles = page.getByRole("article");
    await expect(articles).toHaveCount(3);

    // Bookmark an article
    const firstArticle = articles.first();
    await firstArticle.getByTestId("save-button").click();

    // Verify the button icon changes, but the search results remain
    await expect(firstArticle.getByTestId("delete-button")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Search results" })
    ).toBeVisible();
    await expect(articles).toHaveCount(3);
  });
});
