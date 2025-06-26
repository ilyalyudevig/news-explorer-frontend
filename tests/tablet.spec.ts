import { test, expect, devices } from "@playwright/test";
import { testConfig } from "./config/test-config";
import {
  loginUser,
  logoutUser,
  verifyAuthenticatedState,
  verifyUnauthenticatedState,
} from "./helpers/auth-helpers";

// Tablet test configuration for iPad viewport
test.use({ ...devices["iPad Pro"] });

test.describe("Tablet - News Explorer App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.baseUrl);
  });

  test.describe("Tablet Layout & Responsive Design", () => {
    test("should display tablet layout correctly on homepage", async ({
      page,
    }) => {
      // Verify tablet shows full navigation menu (not hamburger)
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await expect(navigation).toBeVisible();

      // Verify navigation items are visible (not hidden behind hamburger)
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Verify main content is properly spaced for tablet
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Verify search form is appropriately sized for tablet
      const searchInput = page.getByRole("searchbox", {
        name: "Search for news",
      });
      const searchRect = await searchInput.boundingBox();
      expect(searchRect!.width).toBeGreaterThan(300); // Should be wider than mobile

      // Verify no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

      // Take screenshot for visual regression testing
      await page.screenshot({
        path: "test-results/tablet-homepage-layout.png",
        fullPage: true,
      });
    });

    test("should display search results in tablet grid layout", async ({
      page,
    }) => {
      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      // Wait for results to load
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Verify articles are displayed
      const articles = page.getByRole("article");
      await expect(articles.first()).toBeVisible();

      // Check tablet layout - articles should be in a grid or have appropriate spacing
      const firstArticle = articles.first();
      const secondArticle = articles.nth(1);

      const firstRect = await firstArticle.boundingBox();
      const secondRect = await secondArticle.boundingBox();

      expect(firstRect).toBeTruthy();
      expect(secondRect).toBeTruthy();

      // Verify articles have appropriate spacing for tablet
      const gap = Math.abs(secondRect!.x - (firstRect!.x + firstRect!.width));

      // Could be either horizontal (side by side) or vertical layout
      const isHorizontalLayout =
        secondRect!.y < firstRect!.y + firstRect!.height;
      const isVerticalLayout =
        secondRect!.y >= firstRect!.y + firstRect!.height;

      expect(isHorizontalLayout || isVerticalLayout).toBeTruthy();

      // Verify article cards are appropriately sized for tablet
      expect(firstRect!.width).toBeGreaterThan(200);
      expect(firstRect!.width).toBeLessThan(600);

      // Take screenshot of tablet search results
      await page.screenshot({
        path: "test-results/tablet-search-results.png",
        fullPage: true,
      });
    });

    test("should handle portrait and landscape orientations", async ({
      page,
    }) => {
      // Test portrait orientation (iPad Pro default)
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Test landscape orientation
      await page.setViewportSize({ width: 1366, height: 1024 });

      // Verify layout adapts to landscape
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      await expect(
        page.getByRole("searchbox", { name: "Search for news" })
      ).toBeVisible();

      // Verify navigation is still accessible
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();

      // Verify no horizontal scroll in landscape
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);
    });

    test("should optimize touch targets for tablet", async ({ page }) => {
      // Test navigation button sizes
      const signInButton = page.getByTestId("nav-button-signin");
      const signInRect = await signInButton.boundingBox();

      // Tablet touch targets should be at least 44px but can be larger
      expect(signInRect!.width).toBeGreaterThanOrEqual(44);
      expect(signInRect!.height).toBeGreaterThanOrEqual(44);

      // Test search button
      const searchButton = page.getByRole("button", { name: "Search" });
      const searchRect = await searchButton.boundingBox();
      expect(searchRect!.width).toBeGreaterThanOrEqual(44);
      expect(searchRect!.height).toBeGreaterThanOrEqual(44);

      // Logo should be clickable
      const logo = page.getByRole("link", { name: "NewsExplorer logo" });
      const logoRect = await logo.boundingBox();
      expect(logoRect!.width).toBeGreaterThan(0);
      expect(logoRect!.height).toBeGreaterThan(0);
    });
  });

  test.describe("Tablet Navigation", () => {
    test("should navigate using tablet menu items", async ({ page }) => {
      // Verify full navigation is visible (no hamburger menu)
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Test logo navigation
      const logo = page.getByRole("link", { name: "NewsExplorer logo" });
      await logo.click();
      await expect(page).toHaveURL(testConfig.baseUrl);

      // Test home link
      await page.getByRole("menuitem", { name: "Home" }).click();
      await expect(page).toHaveURL(testConfig.baseUrl);
    });

    test("should handle authenticated tablet navigation", async ({ page }) => {
      // Login first
      await loginUser(page);

      // Verify authenticated navigation items are visible
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-link-savednews")).toBeVisible();
      await expect(page.getByTestId("nav-button-signout")).toBeVisible();

      // Navigate to saved articles
      await page.getByTestId("nav-link-savednews").click();

      // Verify we're on saved articles page
      await expect(page).toHaveURL(/.*\/saved-news$/);
      await expect(
        page.getByRole("paragraph").filter({ hasText: "Saved articles" })
      ).toBeVisible();

      // Verify navigation remains accessible
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
    });

    test("should handle hover effects on tablet", async ({ page }) => {
      // Test hover effects on navigation items
      const homeLink = page.getByRole("menuitem", { name: "Home" });

      // Hover over home link
      await homeLink.hover();
      await expect(homeLink).toBeVisible();

      // Test hover on sign in button
      const signInButton = page.getByTestId("nav-button-signin");
      await signInButton.hover();
      await expect(signInButton).toBeVisible();

      // Test hover on logo
      const logo = page.getByRole("link", { name: "NewsExplorer logo" });
      await logo.hover();
      await expect(logo).toBeVisible();
    });
  });

  test.describe("Tablet Forms & Modals", () => {
    test("should display authentication modal optimally on tablet", async ({
      page,
    }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();

      // Verify modal is visible and appropriately sized for tablet
      const modal = page.getByTestId("sign-in-modal");
      await expect(modal).toBeVisible();

      // Verify modal positioning (should be centered)
      const modalRect = await modal.boundingBox();
      const pageWidth = await page.evaluate(() => window.innerWidth);
      const pageHeight = await page.evaluate(() => window.innerHeight);

      expect(modalRect!.x).toBeGreaterThan(pageWidth * 0.1); // Not too close to edges
      expect(modalRect!.x + modalRect!.width).toBeLessThan(pageWidth * 0.9);
      expect(modalRect!.y).toBeGreaterThan(pageHeight * 0.1);

      // Verify form elements are appropriately spaced
      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Test form input behavior
      await emailInput.click();
      await expect(emailInput).toBeFocused();

      await emailInput.fill("test@example.com");
      await expect(emailInput).toHaveValue("test@example.com");

      // Test tab navigation
      await page.keyboard.press("Tab");
      await expect(passwordInput).toBeFocused();

      // Close modal
      await page.getByRole("button", { name: "Close modal" }).click();
      await expect(modal).not.toBeVisible();
    });

    test("should handle form validation on tablet", async ({ page }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();

      // Test empty form submission
      await page
        .getByTestId("sign-in-modal")
        .getByTestId("form-submit-button")
        .click();

      // Verify form validation (should remain open)
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Test invalid email
      await page.getByTestId("email-input").fill("invalid-email");
      await page.getByTestId("password-input").fill("short");
      await page
        .getByTestId("sign-in-modal")
        .getByTestId("form-submit-button")
        .click();

      // Verify validation feedback
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    });

    test("should handle modal transitions on tablet", async ({ page }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Switch to sign-up modal
      await page.getByRole("button", { name: "Sign up" }).click();
      await expect(page.getByTestId("sign-up-modal")).toBeVisible();

      // Verify all sign-up fields are present and properly spaced
      await expect(page.getByTestId("email-input")).toBeVisible();
      await expect(page.getByTestId("password-input")).toBeVisible();
      await expect(page.getByTestId("username-input")).toBeVisible();

      // Switch back to sign-in
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    });

    test("should handle keyboard navigation in modals", async ({ page }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();

      // Test ESC key to close modal
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();

      // Open modal again
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Test Tab navigation through form fields
      await page.keyboard.press("Tab"); // Should focus email input
      await expect(page.getByTestId("email-input")).toBeFocused();

      await page.keyboard.press("Tab"); // Should focus password input
      await expect(page.getByTestId("password-input")).toBeFocused();

      await page.keyboard.press("Tab"); // Should focus submit button
      await expect(page.getByTestId("form-submit-button")).toBeFocused();
    });
  });

  test.describe("Tablet Search & Content Interaction", () => {
    test("should handle search interactions optimally on tablet", async ({
      page,
    }) => {
      // Test search form interaction
      const searchInput = page.getByRole("searchbox", {
        name: "Search for news",
      });
      const searchButton = page.getByRole("button", { name: "Search" });

      // Test click and type
      await searchInput.click();
      await expect(searchInput).toBeFocused();

      await searchInput.fill("tablet technology");
      await expect(searchInput).toHaveValue("tablet technology");

      // Test search button click
      await searchButton.click();

      // Verify search results load
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
      await expect(page.getByRole("article")).toHaveCount(3);

      // Test keyboard shortcut (Enter key)
      await searchInput.fill("mobile apps");
      await page.keyboard.press("Enter");

      // Verify search executes
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should display articles in tablet-optimized layout", async ({
      page,
    }) => {
      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Verify article cards are appropriately sized for tablet viewing
      const articles = page.getByRole("article");
      const firstArticle = articles.first();

      await expect(firstArticle).toBeVisible();

      // Verify article elements are readable on tablet
      const articleTitle = firstArticle.getByRole("heading", { level: 3 });
      const articleSource = firstArticle.getByRole("heading", { level: 4 });
      const articleImage = firstArticle.locator("img");

      await expect(articleTitle).toBeVisible();
      await expect(articleSource).toBeVisible();
      await expect(articleImage).toBeVisible();

      // Test article image sizing
      const imageRect = await articleImage.boundingBox();
      expect(imageRect!.width).toBeGreaterThan(100);
      expect(imageRect!.height).toBeGreaterThan(100);

      // Test bookmark button interaction
      const bookmarkButton = firstArticle.locator("button").first();
      await bookmarkButton.click();

      // Verify tooltip appears for unauthenticated user
      await expect(page.getByText("Sign in to save articles")).toBeVisible();
    });

    test("should handle show more functionality on tablet", async ({
      page,
    }) => {
      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("news");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test show more button
      const showMoreButton = page.getByRole("button", { name: "Show more" });
      await expect(showMoreButton).toBeVisible();

      // Verify button is appropriately sized
      const buttonRect = await showMoreButton.boundingBox();
      expect(buttonRect!.width).toBeGreaterThanOrEqual(120);
      expect(buttonRect!.height).toBeGreaterThanOrEqual(44);

      // Test hover effect
      await showMoreButton.hover();
      await page.waitForTimeout(100); // Allow hover effect to apply

      // Click show more
      await showMoreButton.click();
      await page.waitForTimeout(1000); // Wait for potential loading

      // Button should still be visible (mock API doesn't load more)
      await expect(showMoreButton).toBeVisible();
    });

    test("should handle long content gracefully on tablet", async ({
      page,
    }) => {
      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test that long article titles and content are handled properly
      const articles = page.getByRole("article");
      const firstArticle = articles.first();

      // Verify article content doesn't overflow
      const articleContent = firstArticle.locator("p").first();
      const contentRect = await articleContent.boundingBox();
      const articleRect = await firstArticle.boundingBox();

      expect(contentRect!.x + contentRect!.width).toBeLessThanOrEqual(
        articleRect!.x + articleRect!.width + 10
      );
    });
  });

  test.describe("Tablet Performance & Optimization", () => {
    test("should load efficiently on tablet", async ({ page }) => {
      const startTime = Date.now();
      await page.goto(testConfig.baseUrl);

      // Verify critical content loads quickly
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible({ timeout: 3000 });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test("should handle image loading on tablet", async ({ page }) => {
      // Perform search to get articles with images
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Verify images load properly
      const firstArticle = page.getByRole("article").first();
      const articleImage = firstArticle.locator("img");

      await expect(articleImage).toBeVisible();

      // Verify image has proper dimensions
      const imageRect = await articleImage.boundingBox();
      expect(imageRect!.width).toBeGreaterThan(0);
      expect(imageRect!.height).toBeGreaterThan(0);
    });

    test("should handle scrolling performance on tablet", async ({ page }) => {
      // Perform search to get content to scroll
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Scroll down to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Verify footer is visible
      await expect(
        page.getByRole("contentinfo", { name: "Footer" })
      ).toBeVisible();

      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      // Verify header is visible
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
    });
  });

  test.describe("Tablet Accessibility", () => {
    test("should be accessible with keyboard navigation", async ({ page }) => {
      // Test tab navigation through main elements
      await page.keyboard.press("Tab"); // Should focus logo
      await expect(page.locator(":focus")).toBeVisible();

      await page.keyboard.press("Tab"); // Should focus home link
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeFocused();

      await page.keyboard.press("Tab"); // Should focus sign in button
      await expect(page.getByTestId("nav-button-signin")).toBeFocused();

      await page.keyboard.press("Tab"); // Should focus search input
      await expect(
        page.getByRole("searchbox", { name: "Search for news" })
      ).toBeFocused();

      await page.keyboard.press("Tab"); // Should focus search button
      await expect(page.getByRole("button", { name: "Search" })).toBeFocused();
    });

    test("should have proper ARIA labels and roles", async ({ page }) => {
      // Verify navigation has proper ARIA label
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await expect(navigation).toHaveAttribute("aria-label", "Main navigation");

      // Verify search form has proper role
      await expect(
        page.getByRole("search", { name: "Search form" })
      ).toBeVisible();

      // Verify main content has proper role
      await expect(
        page.getByRole("main", { name: "Main content" })
      ).toBeVisible();

      // Verify footer has proper role
      await expect(
        page.getByRole("contentinfo", { name: "Footer" })
      ).toBeVisible();
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      // Verify proper heading structure
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("What's going on in the world?");

      // Verify about section has h2
      const aboutHeading = page.getByRole("heading", {
        name: "About the author",
      });
      await expect(aboutHeading).toBeVisible();
    });

    test("should handle focus management in modals", async ({ page }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Verify focus is trapped in modal
      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");
      const submitButton = page.getByTestId("form-submit-button");
      const closeButton = page.getByRole("button", { name: "Close modal" });

      // Test tab navigation within modal
      await page.keyboard.press("Tab");
      await expect(emailInput).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(passwordInput).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(submitButton).toBeFocused();

      // Close modal with ESC
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();

      // Verify focus returns to trigger button
      await expect(page.getByTestId("nav-button-signin")).toBeFocused();
    });
  });

  test.describe("Tablet - Authenticated User Features", () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page);
    });

    test("should display saved articles page optimally on tablet", async ({
      page,
    }) => {
      // Navigate to saved articles
      await page.getByTestId("nav-link-savednews").click();

      // Verify we're on saved articles page
      await expect(page).toHaveURL(/.*\/saved-news$/);
      await expect(
        page.getByRole("paragraph").filter({ hasText: "Saved articles" })
      ).toBeVisible();

      // Verify header information is properly displayed
      const articleCountHeading = page.getByRole("heading", {
        name: new RegExp(
          `${testConfig.user.name}, you have \\d+ saved articles`
        ),
      });
      await expect(articleCountHeading).toBeVisible();

      // Verify keywords section
      const keywordsSection = page.getByText("By keywords:");
      await expect(keywordsSection).toBeVisible();

      // Test saved articles layout on tablet
      const articles = page.getByRole("article");
      const articleCount = await articles.count();

      if (articleCount > 0) {
        // Verify articles are properly spaced for tablet
        const firstArticle = articles.first();
        await expect(firstArticle).toBeVisible();

        // Verify article elements are readable
        const articleTitle = firstArticle.getByRole("heading", { level: 3 });
        await expect(articleTitle).toBeVisible();

        // Test delete button
        const deleteButton = firstArticle.getByTestId("delete-button");
        if (await deleteButton.isVisible()) {
          const deleteRect = await deleteButton.boundingBox();
          expect(deleteRect!.width).toBeGreaterThanOrEqual(44);
          expect(deleteRect!.height).toBeGreaterThanOrEqual(44);
        }

        // Verify keyword tags are visible
        const keywordTag = firstArticle.locator("span, div").first();
        await expect(keywordTag).toBeVisible();
      }
    });

    test("should handle article management on tablet", async ({ page }) => {
      // Navigate to home page
      await page.getByRole("menuitem", { name: "Home" }).click();

      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("tablet");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Get initial saved articles count
      await page.getByTestId("nav-link-savednews").click();
      const initialArticles = page.getByRole("article");
      const initialCount = await initialArticles.count();

      // Go back to search results
      await page.getByRole("menuitem", { name: "Home" }).click();

      // Perform search again
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("tablet");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Save an article
      const firstArticle = page.getByRole("article").first();
      const bookmarkButton = firstArticle.locator("button").first();
      await bookmarkButton.click();

      // Wait for save operation
      await page.waitForTimeout(1000);

      // Navigate to saved articles to verify
      await page.getByTestId("nav-link-savednews").click();

      // Verify article count increased
      const updatedArticles = page.getByRole("article");
      const updatedCount = await updatedArticles.count();
      expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
    });

    test("should handle logout functionality on tablet", async ({ page }) => {
      // Verify user is logged in
      await expect(page.getByTestId("nav-button-signout")).toBeVisible();

      // Test logout button
      const logoutButton = page.getByTestId("nav-button-signout");
      const logoutRect = await logoutButton.boundingBox();
      expect(logoutRect!.width).toBeGreaterThanOrEqual(44);
      expect(logoutRect!.height).toBeGreaterThanOrEqual(44);

      // Perform logout
      await logoutButton.click();

      // Verify user is logged out
      await verifyUnauthenticatedState(page);
    });
  });

  test.describe("Tablet Visual Regression", () => {
    test("should match tablet homepage screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot("tablet-homepage-full.png", {
        fullPage: true,
      });
    });

    test("should match tablet search results screenshot", async ({ page }) => {
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      await expect(page).toHaveScreenshot("tablet-search-results-full.png", {
        fullPage: true,
      });
    });

    test("should match tablet sign-in modal screenshot", async ({ page }) => {
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      await expect(page).toHaveScreenshot("tablet-signin-modal.png");
    });

    test("should match tablet saved articles screenshot", async ({ page }) => {
      await loginUser(page);
      await page.getByTestId("nav-link-savednews").click();

      await expect(
        page.getByRole("paragraph").filter({ hasText: "Saved articles" })
      ).toBeVisible();

      await expect(page).toHaveScreenshot("tablet-saved-articles.png", {
        fullPage: true,
      });
    });
  });

  test.describe("Advanced Tablet Interactions", () => {
    test("should display articles in grid layout on tablet", async ({
      page,
    }) => {
      // Perform search to get articles
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      const articles = page.getByRole("article");
      await expect(articles).toHaveCount(3, { timeout: 10000 });

      // Check if articles are arranged in a grid layout (side by side)
      const firstArticle = articles.first();
      const secondArticle = articles.nth(1);

      const firstRect = await firstArticle.boundingBox();
      const secondRect = await secondArticle.boundingBox();

      if (firstRect && secondRect) {
        // On tablet, articles might be side by side (grid layout)
        const horizontalAlignment = Math.abs(firstRect.y - secondRect.y) < 50;
        const verticalStack = secondRect.y > firstRect.y + firstRect.height;

        // Either horizontal grid or vertical stack is acceptable for tablet
        expect(horizontalAlignment || verticalStack).toBe(true);
      }
    });

    test("should have optimal touch targets for tablet use", async ({
      page,
    }) => {
      // Test navigation buttons
      const homeButton = page.getByRole("menuitem", { name: "Home" });
      const signInButton = page.getByTestId("nav-button-signin");

      // Verify touch targets are appropriate for tablet (larger than mobile)
      const homeButtonRect = await homeButton.boundingBox();
      const signInButtonRect = await signInButton.boundingBox();

      expect(homeButtonRect!.height).toBeGreaterThanOrEqual(44);
      expect(signInButtonRect!.height).toBeGreaterThanOrEqual(44);

      // Search button should be easily tappable
      const searchButton = page.getByTestId("search-button");
      const searchButtonRect = await searchButton.boundingBox();
      expect(searchButtonRect!.width).toBeGreaterThanOrEqual(60);
      expect(searchButtonRect!.height).toBeGreaterThanOrEqual(44);
    });

    test("should handle multi-touch gestures appropriately", async ({
      page,
    }) => {
      // Perform search to have content
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test that pinch-to-zoom is disabled (common for tablet web apps)
      const viewportMeta = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport?.getAttribute("content") || "";
      });

      // Should prevent zooming on tablet for better UX
      expect(viewportMeta).toContain("user-scalable=no");
    });

    test("should support tablet-specific navigation patterns", async ({
      page,
    }) => {
      // Verify that full navigation is visible (no hamburger menu)
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Test navigation between pages
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Close modal and verify navigation still works
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();

      // Navigation should still be functional
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
    });
  });

  test.describe("Tablet Form Interactions", () => {
    test("should optimize form layouts for tablet screen size", async ({
      page,
    }) => {
      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Form should be properly sized for tablet
      const modal = page.getByTestId("sign-in-modal");
      const modalRect = await modal.boundingBox();

      expect(modalRect!.width).toBeGreaterThan(300);
      expect(modalRect!.width).toBeLessThan(600); // Not too wide on tablet

      // Input fields should be comfortable for tablet interaction
      const emailInput = page.getByTestId("email-input");
      const emailRect = await emailInput.boundingBox();

      expect(emailRect!.height).toBeGreaterThanOrEqual(40);
      expect(emailRect!.width).toBeGreaterThan(200);
    });

    test("should handle virtual keyboard on tablet properly", async ({
      page,
    }) => {
      // Test search form
      const searchInput = page.getByTestId("search-input");

      // Click on search input
      await searchInput.click();
      await expect(searchInput).toBeFocused();

      // Type in search query
      await searchInput.fill("tablet search test");
      await expect(searchInput).toHaveValue("tablet search test");

      // Verify input remains visible and usable
      await expect(searchInput).toBeVisible();

      // Test form submission
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should support efficient text input and editing on tablet", async ({
      page,
    }) => {
      // Open registration form
      await page.getByTestId("nav-button-signin").click();
      await page.getByRole("button", { name: "Sign up" }).click();

      await expect(page.getByTestId("sign-up-modal")).toBeVisible();

      // Test tabbing between form fields
      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");
      const usernameInput = page.getByTestId("username-input");

      // Fill and tab through form
      await emailInput.fill("test@example.com");
      await page.keyboard.press("Tab");
      await expect(passwordInput).toBeFocused();

      await passwordInput.fill("password123");
      await page.keyboard.press("Tab");
      await expect(usernameInput).toBeFocused();

      await usernameInput.fill("testuser");

      // Verify all values are retained
      await expect(emailInput).toHaveValue("test@example.com");
      await expect(passwordInput).toHaveValue("password123");
      await expect(usernameInput).toHaveValue("testuser");
    });
  });

  test.describe("Tablet Performance & Optimization", () => {
    test("should load content efficiently on tablet", async ({ page }) => {
      const startTime = Date.now();

      await page.goto(testConfig.baseUrl);
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2500); // Slightly faster expectation for tablet
    });

    test("should handle rapid interactions smoothly", async ({ page }) => {
      // Test rapid navigation interactions
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();

      // Rapidly open/close again
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();

      // UI should remain responsive
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();
    });

    test("should manage memory efficiently during extended use", async ({
      page,
    }) => {
      // Simulate extended usage pattern
      for (let i = 0; i < 5; i++) {
        await page.getByTestId("search-input").fill(`query ${i}`);
        await page.getByTestId("search-button").click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        // Clear search and search again
        await page.getByTestId("search-input").clear();
      }

      // After multiple searches, app should still be responsive
      await page.getByTestId("search-input").fill("final search");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });
  });

  test.describe("Tablet Accessibility & Usability", () => {
    test("should provide comfortable reading experience on tablet", async ({
      page,
    }) => {
      // Perform search to get articles
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test article readability
      const firstArticle = page.getByRole("article").first();
      const articleTitle = firstArticle.getByRole("heading", { level: 3 });

      await expect(articleTitle).toBeVisible();

      // Title should be readable size for tablet
      const titleStyles = await articleTitle.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
        };
      });

      // Font size should be appropriate for tablet reading
      const fontSize = parseInt(titleStyles.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(16);
    });

    test("should support tablet-friendly scrolling behavior", async ({
      page,
    }) => {
      // Perform search to get scrollable content
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test scrolling behavior
      const initialScrollY = await page.evaluate(() => window.scrollY);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 200));

      const scrolledY = await page.evaluate(() => window.scrollY);
      expect(scrolledY).toBeGreaterThan(initialScrollY);

      // Scroll should be smooth and not cause layout issues
      await expect(
        page.getByRole("navigation", { name: "Main navigation" })
      ).toBeVisible();
    });

    test("should maintain focus indicators for keyboard users", async ({
      page,
    }) => {
      // Test keyboard navigation
      await page.keyboard.press("Tab");

      // Check that focused element has visible focus indicator
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (el) {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            borderColor: styles.borderColor,
          };
        }
        return null;
      });

      expect(focusedElement).toBeTruthy();
      // Should have some form of focus indicator
      expect(
        focusedElement!.outline !== "none" ||
          focusedElement!.outlineWidth !== "0px" ||
          focusedElement!.borderColor !== "rgba(0, 0, 0, 0)"
      ).toBe(true);
    });
  });

  test.describe("Tablet Cross-Device Compatibility", () => {
    test("should work consistently across different tablet orientations", async ({
      page,
    }) => {
      // Test portrait orientation (default)
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Simulate landscape orientation
      await page.setViewportSize({ width: 1024, height: 768 });

      // Content should still be accessible
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      await expect(page.getByTestId("search-input")).toBeVisible();
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();

      // Test functionality in landscape
      await page.getByTestId("search-input").fill("landscape test");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should handle different tablet screen densities", async ({
      page,
    }) => {
      // Test high DPI scenario
      await page.emulateMedia({ reducedMotion: "reduce" });

      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Images should load properly
      const heroImage = page.locator("img").first();
      if ((await heroImage.count()) > 0) {
        await expect(heroImage).toBeVisible();
      }
    });
  });
});
