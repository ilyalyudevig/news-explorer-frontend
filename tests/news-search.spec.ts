import { test, expect } from "@playwright/test";

test.describe("News Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the News Explorer homepage
    await page.goto("http://localhost:3000/");
  });

  test("should display the homepage with search form", async ({ page }) => {
    // Verify the page loads correctly
    await expect(page).toHaveTitle("News Explorer");

    // Verify main heading is visible
    await expect(
      page.getByRole("heading", { name: "What's going on in the world?" })
    ).toBeVisible();

    // Verify search form elements are present
    await expect(
      page.getByRole("searchbox", { name: "Search for news" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();

    // Verify navigation elements
    await expect(
      page.getByRole("link", { name: "NewsExplorer logo" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("should perform news search and display results", async ({ page }) => {
    // Enter search term in the search input
    const searchTerm = "technology";
    await page
      .getByRole("searchbox", { name: "Search for news" })
      .fill(searchTerm);

    // Verify the search term is entered correctly
    await expect(
      page.getByRole("searchbox", { name: "Search for news" })
    ).toHaveValue(searchTerm);

    // Click the search button
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for search results to load and verify they are displayed
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Search results" })
    ).toBeVisible();

    // Verify that news articles are displayed
    const articles = page.getByRole("article");
    await expect(articles.first()).toBeVisible();

    // Verify each article has expected elements
    const firstArticle = articles.first();
    await expect(firstArticle.getByRole("heading", { level: 3 })).toBeVisible(); // Article title
    await expect(firstArticle.getByRole("heading", { level: 4 })).toBeVisible(); // Article source
    await expect(firstArticle.locator("img")).toBeVisible(); // Article image
    await expect(firstArticle.locator("p").first()).toBeVisible(); // Article date

    // Verify Show more button is present for pagination
    await expect(page.getByRole("button", { name: "Show more" })).toBeVisible();
  });

  test("should show authentication tooltip when trying to bookmark articles", async ({
    page,
  }) => {
    // Perform a search first
    await page
      .getByRole("searchbox", { name: "Search for news" })
      .fill("technology");
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for search results to load
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();

    // Click on the bookmark button of the first article
    const firstArticle = page.getByRole("article").first();
    const bookmarkButton = firstArticle.locator("button").first();
    await bookmarkButton.click();

    // Verify tooltip message appears indicating user needs to sign in
    await expect(page.getByText("Sign in to save articles")).toBeVisible();
  });

  test("should maintain search results when navigating via logo", async ({
    page,
  }) => {
    // Enter search term and perform search
    await page
      .getByRole("searchbox", { name: "Search for news" })
      .fill("technology");
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for results to load
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();

    // Click on logo to navigate back to home
    await page.getByRole("link", { name: "NewsExplorer logo" }).click();

    // Verify we're back on the homepage and main heading is visible
    await expect(
      page.getByRole("heading", { name: "What's going on in the world?" })
    ).toBeVisible();

    // Verify search results are still visible (the app maintains search state)
    await expect(
      page.getByRole("region", { name: "Search results" })
    ).toBeVisible();

    // Verify the search form is still accessible
    await expect(
      page.getByRole("searchbox", { name: "Search for news" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("should display about section and footer information", async ({
    page,
  }) => {
    // Verify About the author section is visible
    await expect(
      page.getByRole("region", { name: "About the author" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "About the author" })
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Author's avatar" })
    ).toBeVisible();

    // Verify footer information
    await expect(
      page.getByRole("contentinfo", { name: "Footer" })
    ).toBeVisible();
    await expect(
      page.getByText("© 2025 Supersite, Powered by News API")
    ).toBeVisible();

    // Verify footer links
    await expect(page.getByRole("link", { name: "TripleTen" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "GitHub profile" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Facebook profile" })
    ).toBeVisible();
  });
});
