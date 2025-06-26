import { test, expect } from "@playwright/test";
import { testConfig } from "./config/test-config";
import {
  MOBILE_DEVICES,
  TABLET_DEVICES,
  PERFORMANCE_BUDGETS,
  ACCESSIBILITY_REQUIREMENTS,
  NETWORK_CONDITIONS,
} from "./config/mobile-tablet-config";
import {
  setupDevice,
  openNavigation,
  closeNavigation,
  openSignInModal,
  performSearch,
  verifyTouchTargets,
  testModalFocusTrap,
  takeDeviceScreenshots,
  DEVICE_CONFIGS,
} from "./helpers/mobile-tablet-helpers";

test.describe("Comprehensive Mobile & Tablet Test Suite", () => {
  test.describe("Multi-Device Layout Testing", () => {
    Object.entries(MOBILE_DEVICES).forEach(([deviceKey, device]) => {
      test(`should display correctly on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto(testConfig.baseUrl);

        // Verify main content is visible
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        // Verify mobile-specific navigation (hamburger menu)
        const hamburgerButton = page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("button")
          .first();
        await expect(hamburgerButton).toBeVisible();

        // Test hamburger menu functionality
        await hamburgerButton.click();
        await expect(
          page.getByRole("menuitem", { name: "Home" })
        ).toBeVisible();

        // Verify search form is accessible
        await expect(page.getByTestId("search-input")).toBeVisible();
        await expect(page.getByTestId("search-button")).toBeVisible();

        // Check for horizontal scroll issues
        const scrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const clientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

        // Take screenshot for visual regression
        await takeDeviceScreenshots(
          page,
          "homepage",
          {
            ...device.viewport,
            name: device.name,
            isMobile: true,
          },
          { fullPage: true }
        );
      });
    });

    Object.entries(TABLET_DEVICES).forEach(([deviceKey, device]) => {
      test(`should display correctly on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto(testConfig.baseUrl);

        // Verify main content is visible
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        // Verify tablet-specific navigation (full menu visible)
        await expect(
          page.getByRole("menuitem", { name: "Home" })
        ).toBeVisible();
        await expect(page.getByTestId("nav-button-signin")).toBeVisible();

        // Verify search form is appropriately sized for tablet
        const searchInput = page.getByTestId("search-input");
        const searchRect = await searchInput.boundingBox();
        expect(searchRect!.width).toBeGreaterThan(300);

        // Check for horizontal scroll issues
        const scrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const clientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

        // Take screenshot for visual regression
        await takeDeviceScreenshots(
          page,
          "homepage",
          {
            ...device.viewport,
            name: device.name,
            isMobile: false,
          },
          { fullPage: true }
        );
      });
    });
  });

  test.describe("Touch Target Accessibility", () => {
    test("should meet touch target size requirements on mobile", async ({
      page,
    }) => {
      await setupDevice(page, DEVICE_CONFIGS.mobile);
      await page.goto(testConfig.baseUrl);

      // Test search button touch target
      await verifyTouchTargets(
        page,
        '[data-testid="search-button"]',
        ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
      );

      // Test navigation elements
      await openNavigation(page, DEVICE_CONFIGS.mobile);
      await verifyTouchTargets(
        page,
        '[data-testid="nav-button-signin"]',
        ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
      );

      // Test article bookmark buttons after search
      await closeNavigation(page, DEVICE_CONFIGS.mobile);
      await performSearch(page, "technology", DEVICE_CONFIGS.mobile);

      // Verify article bookmark buttons are appropriately sized
      const bookmarkButtons = page.getByRole("article").locator("button");
      const buttonCount = await bookmarkButtons.count();

      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = bookmarkButtons.nth(i);
        const buttonRect = await button.boundingBox();

        if (buttonRect) {
          expect(buttonRect.width).toBeGreaterThanOrEqual(
            ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
          );
          expect(buttonRect.height).toBeGreaterThanOrEqual(
            ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
          );
        }
      }
    });

    test("should meet touch target size requirements on tablet", async ({
      page,
    }) => {
      await setupDevice(page, DEVICE_CONFIGS.tablet);
      await page.goto(testConfig.baseUrl);

      // Test navigation buttons (should be comfortably sized for tablet)
      await verifyTouchTargets(
        page,
        '[data-testid="nav-button-signin"]',
        ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
      );

      // Test search functionality
      await performSearch(page, "tablet test", DEVICE_CONFIGS.tablet);

      // Verify article interactions are tablet-friendly
      const articles = page.getByRole("article");
      const articleCount = await articles.count();

      if (articleCount > 0) {
        const firstArticle = articles.first();
        const bookmarkButton = firstArticle.locator("button").first();
        const buttonRect = await bookmarkButton.boundingBox();

        expect(buttonRect!.width).toBeGreaterThanOrEqual(
          ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
        );
        expect(buttonRect!.height).toBeGreaterThanOrEqual(
          ACCESSIBILITY_REQUIREMENTS.touchTargetMinSize
        );
      }
    });
  });

  test.describe("Form Interaction Testing", () => {
    test("should handle form interactions properly on mobile", async ({
      page,
    }) => {
      await setupDevice(page, DEVICE_CONFIGS.mobile);
      await page.goto(testConfig.baseUrl);

      // Test sign-in modal form
      await openSignInModal(page, DEVICE_CONFIGS.mobile);

      // Test form inputs with virtual keyboard considerations
      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");

      await emailInput.click();
      await expect(emailInput).toBeFocused();
      await emailInput.fill("mobile-test@example.com");

      await passwordInput.click();
      await expect(passwordInput).toBeFocused();
      await passwordInput.fill("password123");

      // Verify form values are retained
      await expect(emailInput).toHaveValue("mobile-test@example.com");
      await expect(passwordInput).toHaveValue("password123");

      // Test focus trapping in modal
      await testModalFocusTrap(page, '[data-testid="sign-in-modal"]');

      // Test keyboard dismissal
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();
    });

    test("should handle form interactions properly on tablet", async ({
      page,
    }) => {
      await setupDevice(page, DEVICE_CONFIGS.tablet);
      await page.goto(testConfig.baseUrl);

      // Test sign-up modal form on tablet
      await page.getByTestId("nav-button-signin").click();
      await page.getByRole("button", { name: "Sign up" }).click();

      await expect(page.getByTestId("sign-up-modal")).toBeVisible();

      // Test all form fields
      const emailInput = page.getByTestId("email-input");
      const passwordInput = page.getByTestId("password-input");
      const usernameInput = page.getByTestId("username-input");

      // Fill form using tab navigation (tablet-friendly)
      await emailInput.fill("tablet-test@example.com");
      await page.keyboard.press("Tab");
      await expect(passwordInput).toBeFocused();

      await passwordInput.fill("securepassword");
      await page.keyboard.press("Tab");
      await expect(usernameInput).toBeFocused();

      await usernameInput.fill("tabletuser");

      // Verify all values are correct
      await expect(emailInput).toHaveValue("tablet-test@example.com");
      await expect(passwordInput).toHaveValue("securepassword");
      await expect(usernameInput).toHaveValue("tabletuser");
    });
  });

  test.describe("Performance Testing", () => {
    test("should meet performance budgets on mobile", async ({ page }) => {
      await setupDevice(page, DEVICE_CONFIGS.mobile);

      // Test page load performance
      const startTime = Date.now();
      await page.goto(testConfig.baseUrl);
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.mobile.pageLoadTime);

      // Test search performance
      const searchStartTime = Date.now();
      await performSearch(page, "performance test", DEVICE_CONFIGS.mobile);
      const searchTime = Date.now() - searchStartTime;

      expect(searchTime).toBeLessThan(
        PERFORMANCE_BUDGETS.mobile.searchResponseTime
      );
    });

    test("should meet performance budgets on tablet", async ({ page }) => {
      await setupDevice(page, DEVICE_CONFIGS.tablet);

      // Test page load performance (should be faster on tablet)
      const startTime = Date.now();
      await page.goto(testConfig.baseUrl);
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.tablet.pageLoadTime);

      // Test search performance
      const searchStartTime = Date.now();
      await performSearch(page, "tablet performance", DEVICE_CONFIGS.tablet);
      const searchTime = Date.now() - searchStartTime;

      expect(searchTime).toBeLessThan(
        PERFORMANCE_BUDGETS.tablet.searchResponseTime
      );
    });

    test("should handle slow network conditions gracefully", async ({
      page,
    }) => {
      // Simulate slow 3G connection
      await page.route("**/*", async (route) => {
        await new Promise((resolve) =>
          setTimeout(resolve, NETWORK_CONDITIONS.slow3G.latency)
        );
        await route.continue();
      });

      await setupDevice(page, DEVICE_CONFIGS.mobile);
      await page.goto(testConfig.baseUrl);

      // Should still load within reasonable time even on slow connection
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible({
        timeout: 10000,
      });

      // Test that user can still interact with the app
      await performSearch(page, "slow network test", DEVICE_CONFIGS.mobile);
    });
  });

  test.describe("Advanced Mobile Interactions", () => {
    test("should handle swipe gestures appropriately", async ({ page }) => {
      await setupDevice(page, DEVICE_CONFIGS.mobile);
      await page.goto(testConfig.baseUrl);

      await performSearch(page, "swipe test", DEVICE_CONFIGS.mobile);

      const firstArticle = page.getByRole("article").first();
      await expect(firstArticle).toBeVisible();

      // Test touch interaction on article
      const articleBox = await firstArticle.boundingBox();
      if (articleBox) {
        await page.touchscreen.tap(
          articleBox.x + articleBox.width / 2,
          articleBox.y + articleBox.height / 2
        );

        // Article should remain functional after touch
        await expect(firstArticle).toBeVisible();
      }
    });

    test("should handle orientation changes", async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();

      // Rotate to landscape
      await page.setViewportSize({ width: 667, height: 375 });

      // Content should adapt and remain accessible
      await expect(
        page.getByRole("heading", { name: "What's going on in the world?" })
      ).toBeVisible();
      await expect(page.getByTestId("search-input")).toBeVisible();

      // Test functionality in landscape
      await performSearch(page, "landscape test", {
        ...DEVICE_CONFIGS.mobile,
        width: 667,
        height: 375,
      });
    });
  });

  test.describe("Cross-Device Consistency", () => {
    test("should maintain consistent functionality across all devices", async ({
      page,
    }) => {
      const allDevices = [
        ...Object.entries(MOBILE_DEVICES),
        ...Object.entries(TABLET_DEVICES),
      ];

      for (const [deviceKey, device] of allDevices.slice(0, 3)) {
        // Test first 3 devices to keep test runtime reasonable
        await page.setViewportSize(device.viewport);
        await page.goto(testConfig.baseUrl);

        // Core functionality should work on all devices
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        // Search should work consistently
        await page.getByTestId("search-input").fill(`${device.name} test`);
        await page.getByTestId("search-button").click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        // Navigation should be appropriate for device type
        if (device.isMobile) {
          // Mobile should have hamburger menu
          const hamburgerButton = page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("button")
            .first();
          await expect(hamburgerButton).toBeVisible();
        } else {
          // Tablet should have full navigation
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).toBeVisible();
          await expect(page.getByTestId("nav-button-signin")).toBeVisible();
        }

        // Clear search for next iteration
        await page.getByTestId("search-input").clear();
      }
    });
  });

  test.describe("Error Handling & Edge Cases", () => {
    test("should handle API failures gracefully on mobile", async ({
      page,
    }) => {
      await setupDevice(page, DEVICE_CONFIGS.mobile);

      // Mock API failure
      await page.route("**/everything**", async (route) => {
        await route.abort("failed");
      });

      await page.goto(testConfig.baseUrl);
      await performSearch(page, "error test", DEVICE_CONFIGS.mobile);

      // Should show error state (adjust selector based on your error handling)
      await expect(page.locator('[data-testid="api-error"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test("should handle network disconnection on tablet", async ({ page }) => {
      await setupDevice(page, DEVICE_CONFIGS.tablet);
      await page.goto(testConfig.baseUrl);

      // Simulate network failure after initial load
      await page.route("**/*", async (route) => {
        await route.abort("connectionfailed");
      });

      // Try to perform search
      await page.getByTestId("search-input").fill("offline test");
      await page.getByTestId("search-button").click();

      // App should handle the error gracefully without crashing
      // (Implementation depends on your specific error handling)
    });
  });
});
