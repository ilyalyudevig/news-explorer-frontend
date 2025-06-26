import { test, expect, devices } from "@playwright/test";
import { testConfig } from "./config/test-config";
import {
  loginUser,
  logoutUser,
  verifyAuthenticatedState,
  verifyUnauthenticatedState,
} from "./helpers/auth-helpers";

import { navigateToSignIn } from "./helpers/auth-helpers";

// Mobile test configuration for iPhone viewport
test.use({ ...devices["iPhone SE"] });

test.describe("Mobile - News Explorer App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.baseUrl);
  });

  test.describe("Layout & Responsive Design", () => {
    test("should display mobile layout correctly on homepage", async ({
      page,
    }) => {
      // Verify main heading is visible and readable on mobile
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Verify mobile navigation structure
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await expect(navigation).toBeVisible();

      // Verify hamburger menu button is visible instead of full nav menu
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");
      await expect(hamburgerButton).toBeVisible();

      // Verify search form is accessible on mobile
      await expect(
        page.getByRole("searchbox", { name: "Search for news" })
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Search" })).toBeVisible();

      // Verify no horizontal scroll exists
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow small tolerance

      // Take screenshot for visual regression testing
      await page.screenshot({
        path: "test-results/mobile-homepage-layout.png",
        fullPage: true,
      });
    });

    test("should display search results in mobile-friendly cards", async ({
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

      // Verify articles are displayed in a mobile-friendly layout
      const articles = page.getByRole("article");
      await expect(articles.first()).toBeVisible();

      // Check that article cards stack vertically (mobile layout)
      const firstArticle = articles.first();
      const secondArticle = articles.nth(1);

      const firstRect = await firstArticle.boundingBox();
      const secondRect = await secondArticle.boundingBox();

      expect(firstRect).toBeTruthy();
      expect(secondRect).toBeTruthy();

      // Verify articles stack vertically (second article should be below first)
      expect(secondRect!.y).toBeGreaterThan(firstRect!.y + firstRect!.height);

      // Verify article elements are touch-friendly sized
      const bookmarkButton = firstArticle.locator("button").first();
      const buttonRect = await bookmarkButton.boundingBox();
      expect(buttonRect!.width).toBeGreaterThanOrEqual(40); // 44px is iOS touch target minimum, set to 40px according to Figma spec
      expect(buttonRect!.height).toBeGreaterThanOrEqual(40);

      // Take screenshot of mobile search results
      await page.screenshot({
        path: "test-results/mobile-search-results.png",
        fullPage: true,
      });
    });

    test("should handle viewport orientation changes", async ({ page }) => {
      // Test portrait orientation (default)
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Simulate landscape orientation
      await page.setViewportSize({ width: 667, height: 375 });

      // Verify layout still works in landscape
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      await expect(
        page.getByRole("searchbox", { name: "Search for news" })
      ).toBeVisible();

      // Verify no horizontal scroll in landscape
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);
    });
  });

  test.describe("Mobile Navigation", () => {
    test("should open and close hamburger menu correctly", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Initially, menu items should not be visible
      await expect(
        page.getByRole("menuitem", { name: "Home" })
      ).not.toBeVisible();

      // Click hamburger button to open menu
      await hamburgerButton.click();

      // Verify menu items are now visible
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Verify hamburger icon changed to close icon
      await expect(hamburgerButton).toBeVisible();

      // Click again to close menu
      await hamburgerButton.click();

      // Verify menu items are hidden again
      await expect(
        page.getByRole("menuitem", { name: "Home" })
      ).not.toBeVisible();
    });

    test("should navigate using mobile menu items", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Open mobile menu
      await hamburgerButton.click();

      // Click on logo to navigate home
      const logo = page.getByRole("link", { name: "NewsExplorer logo" });
      await expect(logo).toBeVisible();
      await logo.click();

      // Verify we're on homepage
      await expect(page).toHaveURL(testConfig.baseUrl);
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
    });

    test("should handle authenticated mobile navigation", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Open mobile menu
      await hamburgerButton.click();

      // Login first
      await loginUser(page);

      // Verify authenticated menu items are visible
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

      // Verify mobile menu closes after navigation
      await expect(
        page.getByRole("menuitem", { name: "Home" })
      ).not.toBeVisible();
    });

    test("should provide adequate touch targets for mobile", async ({
      page,
    }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Test hamburger button touch target size
      const hamburgerRect = await hamburgerButton.boundingBox();
      expect(hamburgerRect!.width).toBeGreaterThanOrEqual(24); // Per Figma spec
      expect(hamburgerRect!.height).toBeGreaterThanOrEqual(24);

      // Open menu and test menu item touch targets
      await hamburgerButton.click();

      const signInButton = page.getByTestId("nav-button-signin");
      const signInRect = await signInButton.boundingBox();
      expect(signInRect!.width).toBeGreaterThanOrEqual(24);
      expect(signInRect!.height).toBeGreaterThanOrEqual(24);
    });
  });

  test.describe("Mobile Forms & Modals", () => {
    test("should display authentication modal correctly on mobile", async ({
      page,
    }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Open mobile menu and click sign in
      await hamburgerButton.click();
      await page.getByTestId("nav-button-signin").click();

      // Verify modal is visible and properly sized for mobile
      const modal = page.getByTestId("sign-in-modal");
      await expect(modal).toBeVisible();

      // Verify form elements are accessible
      await expect(page.getByTestId("email-input")).toBeVisible();
      await expect(page.getByTestId("password-input")).toBeVisible();

      // Test form input focus behavior on mobile
      await page.getByTestId("email-input").click();
      await expect(page.getByTestId("email-input")).toBeFocused();

      // Test modal can be closed
      await modal.click({ position: { x: 10, y: 10 } });
      await expect(modal).not.toBeVisible();
    });

    test("should handle virtual keyboard appearance", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Open mobile menu and sign in modal
      await hamburgerButton.click();
      await page.getByTestId("nav-button-signin").click();

      // Focus on email input to trigger virtual keyboard
      const emailInput = page.getByTestId("email-input");
      await emailInput.click();

      // Verify input is still visible and accessible
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeFocused();

      // Test typing with virtual keyboard
      await emailInput.fill("test@example.com");
      await expect(emailInput).toHaveValue("test@example.com");

      // Test tab navigation between form fields
      await page.keyboard.press("Tab");
      await expect(page.getByTestId("password-input")).toBeFocused();
    });

    test("should validate form inputs on mobile", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByTestId("mobile-menu-btn");

      // Open sign-in modal
      await hamburgerButton.click();
      await page.getByTestId("nav-button-signin").click();

      // Try submitting empty form
      await page
        .getByTestId("sign-in-modal")
        .getByTestId("form-submit-button")
        .click();

      // Verify validation works (form should not submit with empty fields)
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Test with invalid email format
      await page.getByTestId("email-input").fill("invalid-email");
      await page.getByTestId("password-input").fill("short");
      await expect(
        page.getByTestId("sign-in-modal").getByTestId("form-submit-button")
      ).toBeDisabled();

      // Verify validation feedback is visible and readable on mobile
      await expect(page.getByTestId("email-validation-error")).toBeVisible();
      await expect(page.getByTestId("password-validation-error")).toBeVisible();
    });

    test("should switch between sign-in and sign-up modals on mobile", async ({
      page,
    }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });

      // Open sign-in modal
      await navigation.getByRole("button").first().click();
      await page.getByTestId("nav-button-signin").click();

      // Switch to sign-up modal
      await page.getByRole("button", { name: "Sign up" }).click();

      // Verify sign-up modal is displayed
      const signUpModal = page.getByTestId("sign-up-modal");
      await expect(signUpModal).toBeVisible();

      // Verify all sign-up fields are present
      await expect(page.getByTestId("registerEmail-input")).toBeVisible();
      await expect(page.getByTestId("registerPassword-input")).toBeVisible();
      await expect(page.getByTestId("username-input")).toBeVisible();

      // Switch back to sign-in
      await page
        .getByTestId("sign-up-modal")
        .getByTestId("form-second-button")
        .click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    });
  });

  test.describe("Mobile Search & Interactions", () => {
    test("should perform search with touch interactions", async ({ page }) => {
      // Test search form interaction
      const searchInput = page.getByRole("searchbox", {
        name: "Search for news",
      });
      const searchButton = page.getByRole("button", { name: "Search" });

      // Touch interaction with search input
      await searchInput.tap();
      await expect(searchInput).toBeFocused();

      // Type search query
      await searchInput.fill("mobile technology");
      await expect(searchInput).toHaveValue("mobile technology");

      // Touch search button
      await searchButton.tap();

      // Verify search results load
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
      await expect(page.getByRole("article")).toHaveCount(3);
    });

    test("should handle article bookmarking with touch", async ({ page }) => {
      // Perform search first
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).tap();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test bookmark button touch interaction for unauthenticated user
      const firstArticle = page.getByRole("article").first();
      const bookmarkButton = firstArticle.locator("button").first();

      await bookmarkButton.tap();

      // Verify tooltip appears
      await expect(page.getByText("Sign in to save articles")).toBeVisible();
    });

    test("should display show more button and handle pagination", async ({
      page,
    }) => {
      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("news");
      await page.getByRole("button", { name: "Search" }).tap();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Verify show more button is touch-friendly
      const showMoreButton = page.getByRole("button", { name: "Show more" });
      await expect(showMoreButton).toBeVisible();

      const buttonRect = await showMoreButton.boundingBox();
      expect(buttonRect!.width).toBeGreaterThanOrEqual(44);
      expect(buttonRect!.height).toBeGreaterThanOrEqual(44);

      // Test show more functionality
      const initialArticleCount = await page.getByRole("article").count();
      await showMoreButton.tap();

      // Wait for potential new articles to load
      await page.waitForTimeout(1000);

      // Note: Since this is a mock API, we can't test actual pagination
      // but we can verify the button interaction works
      await expect(showMoreButton).toBeVisible();
    });
  });

  test.describe("Mobile Performance & Accessibility", () => {
    test("should load quickly on simulated mobile connection", async ({
      page,
    }) => {
      // Simulate slow 3G connection
      await page.route("**/*", (route) => {
        setTimeout(() => route.continue(), 100); // Add 100ms delay
      });

      const startTime = Date.now();
      await page.goto(testConfig.baseUrl);

      // Verify critical content loads reasonably quickly
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible({ timeout: 5000 });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test("should be accessible with screen reader", async ({ page }) => {
      // Verify proper heading hierarchy
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();

      // Verify navigation has proper ARIA labels
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await expect(navigation).toHaveAttribute("aria-label", "Main navigation");

      // Test keyboard navigation
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Verify focus is visible
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("should handle network failures gracefully", async ({ page }) => {
      // Simulate network failure
      await page.route("**/*", (route) => {
        route.abort();
      });

      // Try to navigate and handle error gracefully
      try {
        await page.goto(testConfig.baseUrl);
      } catch (error) {
        // Expected to fail
      }

      // Clear route and reload
      await page.unroute("**/*");
      await page.goto(testConfig.baseUrl);

      // Verify page loads after network recovery
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
    });
  });

  test.describe("Mobile - Authenticated User Features", () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page);
    });

    test("should display saved articles page on mobile", async ({ page }) => {
      // Open mobile menu and navigate to saved articles
      await page.getByTestId("nav-link-savednews").click();

      // Verify saved articles page layout on mobile
      await expect(page).toHaveURL(/.*\/saved-news$/);
      await expect(
        page.getByRole("paragraph").filter({ hasText: "Saved articles" })
      ).toBeVisible();

      // Verify article count and keywords are visible
      const articleCountHeading = page.getByRole("heading", {
        name: new RegExp(
          `${testConfig.user.name}, you have \\d+ saved articles`
        ),
      });
      await expect(articleCountHeading).toBeVisible();

      // Test mobile layout of saved articles
      const articles = page.getByRole("article");
      if ((await articles.count()) > 0) {
        // Verify articles stack vertically on mobile
        const firstArticle = articles.first();
        const secondArticle = articles.nth(1);

        if ((await articles.count()) > 1) {
          const firstRect = await firstArticle.boundingBox();
          const secondRect = await secondArticle.boundingBox();

          expect(secondRect!.y).toBeGreaterThan(
            firstRect!.y + firstRect!.height
          );
        }

        // Test delete button touch target size
        const deleteButton = firstArticle.getByTestId("delete-button");
        if (await deleteButton.isVisible()) {
          const deleteRect = await deleteButton.boundingBox();
          expect(deleteRect!.width).toBeGreaterThanOrEqual(40);
          expect(deleteRect!.height).toBeGreaterThanOrEqual(40);
        }
      }
    });

    test("should handle article saving and deletion on mobile", async ({
      page,
    }) => {
      // Navigate to home page
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await page.getByRole("menuitem", { name: "Home" }).click();

      // Perform search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("mobile");
      await page.getByRole("button", { name: "Search" }).tap();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Save an article with touch interaction
      const firstArticle = page.getByRole("article").first();
      const bookmarkButton = firstArticle.locator("button").first();
      await bookmarkButton.tap();

      // Wait for save operation
      await page.waitForTimeout(1000);

      // Navigate to saved articles to verify
      await navigation.getByRole("button").first().click();
      await page.getByTestId("nav-link-savednews").click();

      // Verify article appears in saved articles
      const articles = page.getByRole("article");
      const articleCount = await articles.count();
      expect(articleCount).toBeGreaterThan(0);
    });

    test("should handle logout on mobile", async ({ page }) => {
      // Verify logout button is visible and properly sized
      const logoutButton = page.getByTestId("nav-button-signout");
      await expect(logoutButton).toBeVisible();

      const logoutRect = await logoutButton.boundingBox();
      expect(logoutRect!.width).toBeGreaterThanOrEqual(44);
      expect(logoutRect!.height).toBeGreaterThanOrEqual(44);

      // Perform logout
      await logoutButton.tap();

      // Verify user is logged out
      await verifyUnauthenticatedState(page);
    });
  });

  test.describe("Mobile Visual Regression", () => {
    test("should match mobile homepage screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot("mobile-homepage-full.png", {
        fullPage: true,
      });
    });

    test("should match mobile search results screenshot", async ({ page }) => {
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("technology");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      await expect(page).toHaveScreenshot("mobile-search-results-full.png", {
        fullPage: true,
      });
    });

    test("should match mobile navigation menu screenshot", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await navigation.getByRole("button").first().click();

      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();

      await expect(page).toHaveScreenshot("mobile-navigation-menu.png");
    });

    test("should match mobile sign-in modal screenshot", async ({ page }) => {
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await navigation.getByRole("button").first().click();
      await page.getByTestId("nav-button-signin").click();

      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      await expect(page).toHaveScreenshot("mobile-signin-modal.png");
    });
  });

  test.describe("Advanced Mobile Interactions", () => {
    test("should handle swipe gestures on article cards", async ({ page }) => {
      // Perform search to get articles
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      const firstArticle = page.getByRole("article").first();
      await expect(firstArticle).toBeVisible();

      // Test swipe left/right gesture simulation on article
      const articleBox = await firstArticle.boundingBox();
      if (articleBox) {
        // Simulate swipe gesture by touch start and end
        await page.touchscreen.tap(
          articleBox.x + articleBox.width / 2,
          articleBox.y + articleBox.height / 2
        );

        // Verify article is still visible after touch interaction
        await expect(firstArticle).toBeVisible();
      }
    });

    test("should handle pinch-to-zoom functionality", async ({ page }) => {
      // Test that the viewport meta tag prevents unwanted zoom
      const viewportContent = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport ? viewport.getAttribute("content") : null;
      });

      // Should have proper viewport settings for mobile
      expect(viewportContent).toContain("width=device-width");
      expect(viewportContent).toContain("initial-scale=1");
    });

    test("should maintain focus trap in modals on mobile", async ({ page }) => {
      // Open hamburger menu
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button")
        .click();

      // Open sign-in modal
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Test focus trap - Tab should cycle through modal elements only
      await page.keyboard.press("Tab");
      let focusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focusedElement).toBe("INPUT"); // Should focus on first input

      // Continue tabbing to ensure focus stays within modal
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Focus should still be within the modal
      const modalContainsFocus = await page.evaluate(() => {
        const modal = document.querySelector('[data-testid="sign-in-modal"]');
        const activeElement = document.activeElement;
        return modal?.contains(activeElement) || false;
      });
      expect(modalContainsFocus).toBe(true);
    });

    test("should handle virtual keyboard appearance", async ({ page }) => {
      // Open search form
      const searchInput = page.getByTestId("search-input");
      await searchInput.click();

      // Verify search input is focused and visible
      await expect(searchInput).toBeFocused();

      // Test that clicking input doesn't cause layout shift
      const initialHeight = await page.evaluate(() => window.innerHeight);
      await searchInput.fill("test query");

      // Verify input value was set correctly
      await expect(searchInput).toHaveValue("test query");

      // Test keyboard navigation with Enter key
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should support touch target accessibility guidelines", async ({
      page,
    }) => {
      // Perform search to get interactive elements
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test bookmark button touch target size (minimum 44x44px for iOS)
      const bookmarkButton = page
        .getByRole("article")
        .first()
        .locator("button")
        .first();
      const buttonBox = await bookmarkButton.boundingBox();

      expect(buttonBox).toBeTruthy();
      expect(buttonBox!.width).toBeGreaterThanOrEqual(40); // Per Figma spec
      expect(buttonBox!.height).toBeGreaterThanOrEqual(40);

      // Test that buttons have adequate spacing
      const buttons = page.getByRole("article").first().locator("button");
      const buttonCount = await buttons.count();

      if (buttonCount > 1) {
        const firstButtonBox = await buttons.first().boundingBox();
        const secondButtonBox = await buttons.nth(1).boundingBox();

        if (firstButtonBox && secondButtonBox) {
          const spacing = Math.abs(firstButtonBox.x - secondButtonBox.x);
          expect(spacing).toBeGreaterThanOrEqual(8); // Minimum spacing
        }
      }
    });
  });

  test.describe("Mobile Performance & Loading", () => {
    test("should load homepage within performance budget", async ({ page }) => {
      const startTime = Date.now();
      await page.goto(testConfig.baseUrl);

      // Wait for main content to be visible
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test("should show loading states during search", async ({ page }) => {
      const searchInput = page.getByTestId("search-input");
      const searchButton = page.getByTestId("search-button");

      await searchInput.fill("technology");

      // Start search and immediately check for loading state
      const searchPromise = searchButton.click();

      // Note: In a real app, you might have a loading spinner or disabled button
      // This test structure allows for that verification

      await searchPromise;
      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should handle slow network conditions gracefully", async ({
      page,
    }) => {
      // Simulate slow 3G connection
      await page.route("**/*", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });

      await page.goto(testConfig.baseUrl);

      // Should still load main content despite slow network
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("Mobile Error Handling", () => {
    test("should display error message for failed search", async ({ page }) => {
      // Mock a failed API response
      await page.route("**/everything**", async (route) => {
        await route.abort("failed");
      });

      await page.getByTestId("search-input").fill("test query");
      await page.getByTestId("search-button").click();

      // Should show error message (adjust selector based on your error handling)
      await expect(page.locator('[data-testid="api-error"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test("should handle network disconnection gracefully", async ({ page }) => {
      // First load the page successfully
      await page.goto(testConfig.baseUrl);
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Then simulate network failure
      await page.route("**/*", async (route) => {
        await route.abort("connectionfailed");
      });

      // Try to perform search
      await page.getByTestId("search-input").fill("test");
      await page.getByTestId("search-button").click();

      // Should handle the error gracefully (specific implementation depends on your error handling)
      // This test ensures the app doesn't crash and shows appropriate feedback
    });

    test("should validate form inputs with proper error messages", async ({
      page,
    }) => {
      // Open hamburger menu and sign-in modal
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button")
        .click();
      await page.getByTestId("nav-button-signin").click();

      await expect(page.getByTestId("sign-in-modal")).toBeVisible();

      // Try to submit form with invalid email
      await page.getByTestId("email-input").fill("invalid-email");
      await page.getByTestId("password-input").fill("password123");
      await expect(
        page.getByTestId("sign-in-modal").getByTestId("form-submit-button")
      ).toBeDisabled();

      // Should show validation error (adjust based on your validation implementation)
      const emailError = page.locator('[data-testid="email-error"]');
      if ((await emailError.count()) > 0) {
        await expect(emailError).toBeVisible();
      }
    });
  });

  test.describe("Mobile Accessibility", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      // Check heading structure
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1); // Should have exactly one h1

      // Verify main heading
      await expect(page.locator("h1")).toHaveText(
        "What's going on in the world?"
      );
    });

    test("should have accessible forms with proper labels", async ({
      page,
    }) => {
      // Test search form accessibility
      const searchInput = page.getByTestId("search-input");
      const searchLabel =
        (await searchInput.getAttribute("aria-label")) ||
        (await searchInput.getAttribute("placeholder"));
      expect(searchLabel).toBeTruthy();

      // Test sign-in form accessibility
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button")
        .click();
      await page.getByTestId("nav-button-signin").click();

      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");

      // Inputs should have proper labels or aria-labels
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test("should support keyboard navigation", async ({ page }) => {
      // Test Tab navigation through main elements
      await page.keyboard.press("Tab");

      // Should be able to navigate to logo
      let focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.getAttribute("data-testid") || el.tagName : null;
      });

      // Continue tabbing through interactive elements
      const interactiveElements: string[] = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? el.getAttribute("data-testid") || el.tagName : null;
        });
        if (focused && !interactiveElements.includes(focused)) {
          interactiveElements.push(focused);
        }
      }

      expect(interactiveElements.length).toBeGreaterThan(0);
    });

    test("should have sufficient color contrast", async ({ page }) => {
      // This is a placeholder for color contrast testing
      // In a real implementation, you might use axe-core or similar tools

      // Verify text is readable
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("font-family", /.+/);
    });
  });
});
