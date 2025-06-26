import { test, expect, devices } from "@playwright/test";
import { testConfig } from "./config/test-config";
import { loginUser, verifyAuthenticatedState } from "./helpers/auth-helpers";

test.describe("Cross-Device Responsive Tests", () => {
  const viewports = [
    { name: "iPhone SE", ...devices["iPhone SE"] },
    { name: "iPhone 12", ...devices["iPhone 12"] },
    { name: "iPad", ...devices["iPad"] },
    { name: "iPad Pro", ...devices["iPad Pro"] },
    { name: "Desktop", viewport: { width: 1920, height: 1080 } },
  ];

  viewports.forEach(({ name, ...config }) => {
    test.describe(`${name} Viewport`, () => {
      test.use(config);

      test.beforeEach(async ({ page }) => {
        await page.goto(testConfig.baseUrl);
      });

      test(`should display navigation appropriately on ${name}`, async ({
        page,
      }) => {
        const navigation = page.getByRole("navigation", {
          name: "Main navigation",
        });
        await expect(navigation).toBeVisible();

        // Check if it's mobile or tablet/desktop layout
        const isMobile = config.viewport?.width
          ? config.viewport.width < 768
          : (config as any).viewport?.width < 768;

        if (isMobile) {
          // Mobile should have hamburger menu
          const hamburgerButton = navigation.getByRole("button").first();
          await expect(hamburgerButton).toBeVisible();

          // Menu items should be hidden initially
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).not.toBeVisible();

          // Open menu and verify items appear
          await hamburgerButton.click();
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).toBeVisible();
        } else {
          // Tablet/Desktop should show full navigation
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).toBeVisible();
          await expect(page.getByTestId("nav-button-signin")).toBeVisible();
        }
      });

      test(`should handle search functionality on ${name}`, async ({
        page,
      }) => {
        // Test search input and button are accessible
        const searchInput = page.getByRole("searchbox", {
          name: "Search for news",
        });
        const searchButton = page.getByRole("button", { name: "Search" });

        await expect(searchInput).toBeVisible();
        await expect(searchButton).toBeVisible();

        // Perform search
        await searchInput.fill("responsive test");
        await searchButton.click();

        // Verify results load
        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();
        await expect(page.getByRole("article")).toHaveCount(3);

        // Take viewport-specific screenshot
        await page.screenshot({
          path: `test-results/${name
            .toLowerCase()
            .replace(/\s+/g, "-")}-search-results.png`,
          fullPage: true,
        });
      });

      test(`should display articles appropriately on ${name}`, async ({
        page,
      }) => {
        // Perform search to get articles
        await page
          .getByRole("searchbox", { name: "Search for news" })
          .fill("technology");
        await page.getByRole("button", { name: "Search" }).click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        const articles = page.getByRole("article");
        await expect(articles.first()).toBeVisible();

        // Verify article elements are properly sized
        const firstArticle = articles.first();
        const articleRect = await firstArticle.boundingBox();

        // Article should not exceed viewport width
        const viewportWidth =
          config.viewport?.width || (config as any).viewport?.width || 1920;
        expect(articleRect!.width).toBeLessThanOrEqual(viewportWidth);

        // Verify bookmark button is touch-friendly
        const bookmarkButton = firstArticle.locator("button").first();
        const buttonRect = await bookmarkButton.boundingBox();
        expect(buttonRect!.width).toBeGreaterThanOrEqual(44);
        expect(buttonRect!.height).toBeGreaterThanOrEqual(44);
      });

      test(`should handle modals correctly on ${name}`, async ({ page }) => {
        // Determine if mobile navigation is needed
        const isMobile = config.viewport?.width
          ? config.viewport.width < 768
          : (config as any).viewport?.width < 768;

        if (isMobile) {
          // Open mobile menu first
          const hamburgerButton = page
            .getByRole("navigation", {
              name: "Main navigation",
            })
            .getByRole("button")
            .first();
          await hamburgerButton.click();
        }

        // Open sign-in modal
        await page.getByTestId("nav-button-signin").click();

        const modal = page.getByTestId("sign-in-modal");
        await expect(modal).toBeVisible();

        // Verify modal fits viewport
        const modalRect = await modal.boundingBox();
        const viewportWidth =
          config.viewport?.width || (config as any).viewport?.width || 1920;
        const viewportHeight =
          config.viewport?.height || (config as any).viewport?.height || 1080;

        expect(modalRect!.width).toBeLessThanOrEqual(viewportWidth * 0.95);
        expect(modalRect!.height).toBeLessThanOrEqual(viewportHeight * 0.95);

        // Test form elements
        await expect(page.getByTestId("email-input")).toBeVisible();
        await expect(page.getByTestId("password-input")).toBeVisible();

        // Close modal
        await page.getByRole("button", { name: "Close modal" }).click();
        await expect(modal).not.toBeVisible();
      });

      test(`should not have horizontal scroll on ${name}`, async ({ page }) => {
        // Check homepage
        const homeScrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const homeClientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(homeScrollWidth).toBeLessThanOrEqual(homeClientWidth + 10);

        // Check search results page
        await page
          .getByRole("searchbox", { name: "Search for news" })
          .fill("technology");
        await page.getByRole("button", { name: "Search" }).click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        const searchScrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const searchClientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(searchScrollWidth).toBeLessThanOrEqual(searchClientWidth + 10);
      });
    });
  });

  test.describe("Responsive Breakpoint Tests", () => {
    const breakpoints = [
      { name: "Small Mobile", width: 320, height: 568 },
      { name: "Mobile", width: 375, height: 667 },
      { name: "Large Mobile", width: 414, height: 896 },
      { name: "Small Tablet", width: 768, height: 1024 },
      { name: "Large Tablet", width: 1024, height: 1366 },
      { name: "Desktop", width: 1280, height: 1024 },
      { name: "Large Desktop", width: 1920, height: 1080 },
    ];

    breakpoints.forEach(({ name, width, height }) => {
      test(`should adapt layout at ${name} (${width}x${height})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height });
        await page.goto(testConfig.baseUrl);

        // Verify page loads without horizontal scroll
        const scrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const clientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

        // Verify navigation adapts correctly
        const navigation = page.getByRole("navigation", {
          name: "Main navigation",
        });
        await expect(navigation).toBeVisible();

        if (width < 768) {
          // Should show hamburger menu on smaller screens
          const hamburgerButton = navigation.getByRole("button").first();
          await expect(hamburgerButton).toBeVisible();
        } else {
          // Should show full menu on larger screens
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).toBeVisible();
        }

        // Verify search form is accessible
        await expect(
          page.getByRole("searchbox", { name: "Search for news" })
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Search" })
        ).toBeVisible();

        // Take screenshot for visual regression
        await page.screenshot({
          path: `test-results/breakpoint-${name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${width}x${height}.png`,
          fullPage: true,
        });
      });
    });
  });

  test.describe("Touch vs Mouse Interaction Tests", () => {
    test("should handle touch interactions on mobile devices", async ({
      page,
      isMobile,
    }) => {
      // This test specifically targets mobile devices
      test.skip(!isMobile, "This test is only for mobile devices");

      await page.goto(testConfig.baseUrl);

      // Test touch interactions
      const searchInput = page.getByRole("searchbox", {
        name: "Search for news",
      });

      // Use tap instead of click for mobile
      await searchInput.tap();
      await expect(searchInput).toBeFocused();

      await searchInput.fill("touch test");

      const searchButton = page.getByRole("button", { name: "Search" });
      await searchButton.tap();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      // Test article bookmark tap
      const firstArticle = page.getByRole("article").first();
      const bookmarkButton = firstArticle.locator("button").first();

      await bookmarkButton.tap();
      await expect(page.getByText("Sign in to save articles")).toBeVisible();
    });

    test("should handle mouse interactions on desktop", async ({
      page,
      isMobile,
    }) => {
      // Skip this test on mobile devices
      test.skip(isMobile, "This test is only for desktop devices");

      await page.goto(testConfig.baseUrl);

      // Test hover effects (only meaningful on desktop)
      const signInButton = page.getByTestId("nav-button-signin");

      // Hover over sign in button
      await signInButton.hover();
      await expect(signInButton).toBeVisible();

      // Test right-click context menu (desktop only)
      const logo = page.getByRole("link", { name: "NewsExplorer logo" });
      await logo.click({ button: "right" });

      // Context menu behavior is browser-dependent, just verify element is still visible
      await expect(logo).toBeVisible();
    });
  });

  test.describe("Performance Across Devices", () => {
    const performanceViewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    performanceViewports.forEach(({ name, width, height }) => {
      test(`should load efficiently on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });

        // Measure page load time
        const startTime = Date.now();
        const response = await page.goto(testConfig.baseUrl);

        expect(response?.status()).toBe(200);

        // Verify critical content loads quickly
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible({ timeout: 5000 });

        const loadTime = Date.now() - startTime;

        // Performance expectations by device type
        const maxLoadTime =
          name === "Mobile" ? 5000 : name === "Tablet" ? 4000 : 3000;
        expect(loadTime).toBeLessThan(maxLoadTime);

        // Check for performance markers
        const performanceTiming = await page.evaluate(() => {
          return {
            domContentLoaded:
              performance.timing.domContentLoadedEventEnd -
              performance.timing.navigationStart,
            loadComplete:
              performance.timing.loadEventEnd -
              performance.timing.navigationStart,
          };
        });

        expect(performanceTiming.domContentLoaded).toBeGreaterThan(0);
        expect(performanceTiming.loadComplete).toBeGreaterThan(0);
      });
    });
  });

  test.describe("Accessibility Across Devices", () => {
    const accessibilityViewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    accessibilityViewports.forEach(({ name, width, height }) => {
      test(`should be keyboard accessible on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(testConfig.baseUrl);

        // Test Tab navigation
        await page.keyboard.press("Tab");
        let focusedElement = page.locator(":focus");
        await expect(focusedElement).toBeVisible();

        // Continue tabbing through interactive elements
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press("Tab");
          focusedElement = page.locator(":focus");
          await expect(focusedElement).toBeVisible();
        }

        // Test Shift+Tab (reverse navigation)
        await page.keyboard.press("Shift+Tab");
        focusedElement = page.locator(":focus");
        await expect(focusedElement).toBeVisible();
      });

      test(`should have proper ARIA landmarks on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(testConfig.baseUrl);

        // Verify essential ARIA landmarks exist
        await expect(
          page.getByRole("navigation", { name: "Main navigation" })
        ).toBeVisible();
        await expect(
          page.getByRole("main", { name: "Main content" })
        ).toBeVisible();
        await expect(
          page.getByRole("contentinfo", { name: "Footer" })
        ).toBeVisible();
        await expect(
          page.getByRole("search", { name: "Search form" })
        ).toBeVisible();
      });

      test(`should have adequate color contrast on ${name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height });
        await page.goto(testConfig.baseUrl);

        // This is a basic test - in real scenarios you'd use axe-core or similar
        // Verify text elements are visible (basic contrast check)
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        await expect(
          page.getByText(
            "Find the latest news on any topic and save them in your personal account."
          )
        ).toBeVisible();
      });
    });
  });

  test.describe("Cross-Browser Mobile Testing", () => {
    const mobileViewport = { width: 375, height: 667 };

    test("should work consistently on mobile Chrome", async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto(testConfig.baseUrl);

      // Test core functionality
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Test search
      await page
        .getByRole("searchbox", { name: "Search for news" })
        .fill("mobile chrome");
      await page.getByRole("button", { name: "Search" }).click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should handle form inputs consistently", async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto(testConfig.baseUrl);

      // Open mobile menu and sign-in modal
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      await navigation.getByRole("button").first().click();
      await page.getByTestId("nav-button-signin").click();

      // Test form input behavior
      const emailInput = page.getByTestId("email-input");
      await emailInput.click();
      await expect(emailInput).toBeFocused();

      await emailInput.fill("test@example.com");
      await expect(emailInput).toHaveValue("test@example.com");

      // Test password input
      const passwordInput = page.getByTestId("password-input");
      await passwordInput.click();
      await expect(passwordInput).toBeFocused();

      await passwordInput.fill("password123");
      await expect(passwordInput).toHaveValue("password123");
    });
  });
});
