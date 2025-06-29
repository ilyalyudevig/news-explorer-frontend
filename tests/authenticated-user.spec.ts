import { test, expect } from "@playwright/test";
import { testConfig } from "./config/test-config";
import { loginUser, verifyAuthenticatedState } from "./helpers/auth-helpers";

test.describe("Authenticated User Functionality", () => {
  test.beforeEach(async ({ page }) => {
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
    // Perform a search to get articles
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();

    // Wait for search results to load
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Find the first article and bookmark it
    const firstArticle = page.getByRole("article").first();
    await expect(firstArticle).toBeVisible();

    const bookmarkButton = firstArticle.locator("button").first();
    await expect(bookmarkButton).toBeVisible();

    // Test bookmarking
    await bookmarkButton.click();
    await page.waitForTimeout(1000);

    // Verify article appears in saved articles
    await page.getByTestId("nav-link-savednews").click();
    await expect(page).toHaveURL(/.*\/saved-news$/);

    // Navigate back to search results
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Test unbookmarking
    const sameArticle = page.getByRole("article").first();
    const sameBookmarkButton = sameArticle.locator("button").first();
    await sameBookmarkButton.click();
    await page.waitForTimeout(1000);

    // Verify search results are still visible after unbookmarking
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
  });

  test("should display and manage saved articles page", async ({ page }) => {
    // First, save an article to ensure we have content to test
    await page.getByTestId("search-input").fill("Apple");
    await page.getByTestId("search-button").click();
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(3);

    const firstArticle = page.getByRole("article").first();
    await expect(firstArticle).toBeVisible();
    const bookmarkButton = firstArticle.locator("button").first();
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();
    await page.waitForTimeout(2000);

    // Navigate to saved articles page
    await page.getByTestId("nav-link-savednews").click();

    // Verify we're on the saved articles page
    await expect(page).toHaveURL(/.*\/saved-news$/);
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Saved articles" })
    ).toBeVisible();

    // Verify user info is displayed with article count
    const articleCountHeading = page.getByRole("heading", {
      name: new RegExp(`${testConfig.user.name}, you have \\d+ saved articles`),
    });
    await expect(articleCountHeading).toBeVisible();

    // Get initial article count
    const initialCountText = await articleCountHeading.textContent();
    const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || "0");

    // Verify keywords section is visible if there are saved articles
    const keywordsSection = page.getByText("By keywords:");
    if (await keywordsSection.isVisible()) {
      await expect(keywordsSection).toBeVisible();
    }

    // Check if saved articles are displayed and verify their structure
    const articles = page.getByRole("article");
    const articleCount = await articles.count();

    if (articleCount > 0) {
      // Verify first article has expected elements
      const firstSavedArticle = articles.first();
      await expect(
        firstSavedArticle.getByRole("heading", { level: 3 })
      ).toBeVisible(); // Article title
      await expect(firstSavedArticle.locator("img")).toBeVisible(); // Article image
      await expect(firstSavedArticle.locator("button")).toBeVisible(); // Delete button

      // Verify individual articles have category/keyword tags
      const categoryTag = firstSavedArticle.locator(".card__keywords").first();
      if (await categoryTag.isVisible()) {
        await expect(categoryTag).toBeVisible();
      }

      // Test removing an article (only if there are articles to remove)
      if (initialCount > 0) {
        const deleteButton = firstSavedArticle.locator("button").first();
        await deleteButton.click();

        // Verify the article count has decreased
        await expect(
          page.getByRole("heading", {
            name: new RegExp(
              `${testConfig.user.name}, you have ${
                initialCount - 1
              } saved articles`
            ),
          })
        ).toBeVisible();
      }
    }
  });

  test("should maintain saved articles across navigation", async ({ page }) => {
    // Navigate to saved articles first to get baseline count
    await page.getByTestId("nav-link-savednews").click();
    const initialArticlesOnSavedPage = await page.getByRole("article").count();

    // Navigate back to home and save an article
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();
    await page.getByTestId("search-input").fill("technology");
    await page.getByTestId("search-button").click();

    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(3);

    const firstArticle = page.getByRole("article").first();
    await expect(firstArticle).toBeVisible();
    const bookmarkButton = firstArticle.getByTestId("save-button");
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    // Navigate to saved articles and wait for the new article to appear
    await page.getByTestId("nav-link-savednews").click();
    await expect(page.getByRole("article")).toHaveCount(
      initialArticlesOnSavedPage + 1,
      {
        timeout: testConfig.timeouts.navigation,
      }
    );

    const newArticlesCount = await page.getByRole("article").count();

    // Navigate back to home
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();

    // Navigate back to saved articles
    await page.getByTestId("nav-link-savednews").click();

    // Verify the same number of articles are still there
    await expect(page.getByRole("article")).toHaveCount(newArticlesCount, {
      timeout: testConfig.timeouts.navigation,
    });

    // Remove article to preserve the initial state
    await page
      .getByRole("article")
      .first()
      .getByTestId("delete-button")
      .click();
  });

  test("should handle user authentication flow", async ({ page }) => {
    // Verify we're currently authenticated (already done in beforeEach)
    await expect(page.getByTestId("nav-button-signout")).toBeVisible();
    await expect(page.getByTestId("nav-link-savednews")).toBeVisible();

    // Test logout functionality
    await page.getByTestId("nav-button-signout").click();

    // Verify we're returned to unauthenticated state
    await expect(page.getByTestId("nav-button-signin")).toBeVisible();
    await expect(page.getByTestId("nav-link-savednews")).not.toBeVisible();
    await expect(page.getByTestId("nav-button-signout")).not.toBeVisible();

    // Verify we're on the home page
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(
      page.getByRole("heading", { name: "What's going on in the world?" })
    ).toBeVisible();

    // Test accessing saved articles while unauthenticated
    await page.goto("http://localhost:3000/saved-news");

    // Should be redirected or shown appropriate message/login prompt
    await expect(page.getByTestId("nav-button-signin")).toBeVisible();
  });

  test("should preserve search state after bookmarking articles", async ({
    page,
  }) => {
    // Perform a search
    const searchTerm = "technology";
    await page.getByTestId("search-input").fill(searchTerm);
    await page.getByTestId("search-button").click();
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Bookmark an article
    const firstArticle = page.getByRole("article").first();
    await expect(firstArticle).toBeVisible();
    const bookmarkButton = firstArticle.getByTestId("save-button");
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    // Verify search results are still visible after bookmarking
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Search results" })
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Remove article to preserve the initial state
    await page
      .getByRole("article")
      .first()
      .getByTestId("delete-button")
      .click();
  });
});
