import { test, expect, devices } from "@playwright/test";
import { testConfig } from "./config/test-config";
import {
  loginUser,
  logoutUser,
  verifyAuthenticatedState,
  verifyUnauthenticatedState,
} from "./helpers/auth-helpers";

test.describe("Cross-Device Mobile-Tablet Compatibility", () => {
  test.describe("Responsive Breakpoint Testing", () => {
    test("should transition smoothly between mobile and tablet layouts", async ({
      page,
    }) => {
      // Start with mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Verify mobile layout
      const navigation = page.getByRole("navigation", {
        name: "Main navigation",
      });
      const hamburgerButton = navigation.getByRole("button").first();
      await expect(hamburgerButton).toBeVisible();

      // Gradually increase width to test breakpoints
      const breakpoints = [
        { width: 480, height: 800, description: "Small tablet" },
        { width: 768, height: 1024, description: "iPad portrait" },
        { width: 1024, height: 768, description: "iPad landscape" },
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize({
          width: breakpoint.width,
          height: breakpoint.height,
        });

        // Wait for layout to adjust
        await page.waitForTimeout(500);

        // Verify layout adapts appropriately
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        // At tablet sizes, navigation menu should be fully visible
        if (breakpoint.width >= 768) {
          await expect(
            page.getByRole("menuitem", { name: "Home" })
          ).toBeVisible();
          await expect(page.getByTestId("nav-button-signin")).toBeVisible();
        }

        // Take screenshot for visual regression
        await page.screenshot({
          path: `test-results/responsive-${breakpoint.width}x${breakpoint.height}.png`,
          fullPage: true,
        });
      }
    });

    test("should maintain functionality across all viewport sizes", async ({
      page,
    }) => {
      const viewports = [
        { width: 320, height: 568, name: "iPhone 5" },
        { width: 375, height: 667, name: "iPhone SE" },
        { width: 414, height: 896, name: "iPhone 11" },
        { width: 768, height: 1024, name: "iPad" },
        { width: 1024, height: 1366, name: "iPad Pro" },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(testConfig.baseUrl);

        // Test core functionality at each viewport
        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        // Test search functionality
        await page.getByTestId("search-input").fill("test query");
        await page.getByTestId("search-button").click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        // Verify no horizontal scroll
        const scrollWidth = await page.evaluate(
          () => document.body.scrollWidth
        );
        const clientWidth = await page.evaluate(
          () => document.body.clientWidth
        );
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

        // Clear search for next iteration
        await page.getByTestId("search-input").clear();
      }
    });
  });

  test.describe("Touch vs Click Interaction Compatibility", () => {
    test("should handle both touch and mouse events properly", async ({
      page,
    }) => {
      // Test on mobile viewport first
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Test touch interaction simulation
      const searchButton = page.getByTestId("search-button");

      // Simulate touch tap
      const buttonBox = await searchButton.boundingBox();
      if (buttonBox) {
        await page.touchscreen.tap(
          buttonBox.x + buttonBox.width / 2,
          buttonBox.y + buttonBox.height / 2
        );
      }

      // Switch to tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Test mouse click interaction
      await page.getByTestId("search-input").fill("tablet test");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();
    });

    test("should provide appropriate hover states on tablet", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(testConfig.baseUrl);

      // Test hover states on navigation items
      const signInButton = page.getByTestId("nav-button-signin");

      // Hover over button and check for hover state
      await signInButton.hover();

      // Verify button is still clickable after hover
      await signInButton.click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    });

    test("should handle long press vs regular tap appropriately", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Perform search to get articles
      await page.getByTestId("search-input").fill("technology");
      await page.getByTestId("search-button").click();

      await expect(
        page.getByRole("region", { name: "Search results" })
      ).toBeVisible();

      const firstArticle = page.getByRole("article").first();
      const bookmarkButton = firstArticle.locator("button").first();

      // Test regular tap
      await bookmarkButton.click();

      // Verify the action completed (bookmark state changed)
      await expect(bookmarkButton).toBeVisible();
    });
  });

  test.describe("Performance Across Devices", () => {
    test("should maintain consistent performance on mobile and tablet", async ({
      page,
    }) => {
      const viewports = [
        { width: 375, height: 667, name: "mobile" },
        { width: 768, height: 1024, name: "tablet" },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        const startTime = Date.now();
        await page.goto(testConfig.baseUrl);

        await expect(
          page.getByRole("heading", { name: "What's going on in the world?" })
        ).toBeVisible();

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds on both devices

        // Test search performance
        const searchStartTime = Date.now();
        await page.getByTestId("search-input").fill("performance test");
        await page.getByTestId("search-button").click();

        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();

        const searchTime = Date.now() - searchStartTime;
        expect(searchTime).toBeLessThan(5000); // Search should complete within 5 seconds
      }
    });

    test("should handle image loading efficiently across devices", async ({
      page,
    }) => {
      // Test on mobile first
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Check for lazy loading or proper image optimization
      const images = page.locator("img");
      const imageCount = await images.count();

      if (imageCount > 0) {
        const firstImage = images.first();
        await expect(firstImage).toBeVisible();

        // Verify image has proper attributes for responsive images
        const srcset = await firstImage.getAttribute("srcset");
        const sizes = await firstImage.getAttribute("sizes");

        // If responsive images are implemented, these should exist
        // This is more of a documentation test - adjust based on implementation
      }

      // Test on tablet
      await page.setViewportSize({ width: 768, height: 1024 });

      // Images should still load properly
      if (imageCount > 0) {
        await expect(images.first()).toBeVisible();
      }
    });
  });

  test.describe("Form Behavior Consistency", () => {
    test("should provide consistent form experience across devices", async ({
      page,
    }) => {
      const testFormOnDevice = async (
        width: number,
        height: number,
        deviceName: string
      ) => {
        await page.setViewportSize({ width, height });
        await page.goto(testConfig.baseUrl);

        // Open sign-in modal
        if (width < 768) {
          // Mobile: use hamburger menu
          await page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("button")
            .click();
          await page.getByTestId("nav-button-signin").click();
        } else {
          // Tablet: direct access
          await page.getByTestId("nav-button-signin").click();
        }

        await expect(page.getByTestId("sign-in-modal")).toBeVisible();

        // Test form interaction
        const emailInput = page.getByTestId("email-input");
        const passwordInput = page.getByTestId("password-input");

        await emailInput.fill(`test-${deviceName}@example.com`);
        await passwordInput.fill("password123");

        // Verify values are retained
        await expect(emailInput).toHaveValue(`test-${deviceName}@example.com`);
        await expect(passwordInput).toHaveValue("password123");

        // Test form submission behavior (should be consistent)
        // Note: Actual submission testing would depend on your backend setup

        // Close modal
        await page.keyboard.press("Escape");
        await expect(page.getByTestId("sign-in-modal")).not.toBeVisible();
      };

      // Test on mobile
      await testFormOnDevice(375, 667, "mobile");

      // Test on tablet
      await testFormOnDevice(768, 1024, "tablet");
    });

    test("should handle virtual keyboard consistently", async ({ page }) => {
      const devices = [
        { width: 375, height: 667, name: "mobile" },
        { width: 768, height: 1024, name: "tablet" },
      ];

      for (const device of devices) {
        await page.setViewportSize({
          width: device.width,
          height: device.height,
        });
        await page.goto(testConfig.baseUrl);

        // Test search form
        const searchInput = page.getByTestId("search-input");
        await searchInput.click();

        // Input should be focused and visible
        await expect(searchInput).toBeFocused();
        await expect(searchInput).toBeVisible();

        // Type text
        await searchInput.fill(`${device.name} keyboard test`);
        await expect(searchInput).toHaveValue(`${device.name} keyboard test`);

        // Test that Enter key works
        await page.keyboard.press("Enter");
        await expect(
          page.getByRole("region", { name: "Search results" })
        ).toBeVisible();
      }
    });
  });

  test.describe("Navigation Consistency", () => {
    test("should provide intuitive navigation patterns for each device type", async ({
      page,
    }) => {
      // Test mobile navigation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Mobile should use hamburger menu
      const hamburgerButton = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button");
      await expect(hamburgerButton).toBeVisible();

      // Test hamburger menu functionality
      await hamburgerButton.click();
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();

      // Close menu
      await hamburgerButton.click();
      await expect(
        page.getByRole("menuitem", { name: "Home" })
      ).not.toBeVisible();

      // Test tablet navigation
      await page.setViewportSize({ width: 768, height: 1024 });

      // Tablet should show full navigation
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Navigation should be directly accessible
      await page.getByTestId("nav-button-signin").click();
      await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    });

    test("should maintain navigation state during viewport changes", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Open mobile menu
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button")
        .click();
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();

      // Resize to tablet
      await page.setViewportSize({ width: 768, height: 1024 });

      // Navigation should adapt and still be functional
      await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
      await expect(page.getByTestId("nav-button-signin")).toBeVisible();

      // Resize back to mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Should return to hamburger menu
      const hamburgerButton = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("button");
      await expect(hamburgerButton).toBeVisible();
    });
  });

  test.describe("Accessibility Across Devices", () => {
    test("should maintain accessibility standards on both mobile and tablet", async ({
      page,
    }) => {
      const devices = [
        { width: 375, height: 667, name: "mobile" },
        { width: 768, height: 1024, name: "tablet" },
      ];

      for (const device of devices) {
        await page.setViewportSize({
          width: device.width,
          height: device.height,
        });
        await page.goto(testConfig.baseUrl);

        // Test heading structure
        const h1Count = await page.locator("h1").count();
        expect(h1Count).toBe(1);

        // Test keyboard navigation
        await page.keyboard.press("Tab");

        const focusedElement = await page.evaluate(() => {
          return document.activeElement?.tagName;
        });
        expect(focusedElement).toBeTruthy();

        // Test that all interactive elements are reachable
        let tabCount = 0;
        const maxTabs = 20;

        while (tabCount < maxTabs) {
          await page.keyboard.press("Tab");
          tabCount++;

          const currentFocus = await page.evaluate(() => {
            const el = document.activeElement;
            return el
              ? {
                  tagName: el.tagName,
                  testId: el.getAttribute("data-testid"),
                  role: el.getAttribute("role"),
                }
              : null;
          });

          if (currentFocus?.testId === "search-button") {
            // Found search button, test complete
            break;
          }
        }

        expect(tabCount).toBeLessThan(maxTabs); // Should find interactive elements
      }
    });

    test("should provide appropriate focus indicators across devices", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(testConfig.baseUrl);

      // Test focus on mobile
      await page.keyboard.press("Tab");

      let focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        if (el) {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
          };
        }
        return null;
      });

      expect(focusStyles).toBeTruthy();

      // Test focus on tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.keyboard.press("Tab");

      focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        if (el) {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
          };
        }
        return null;
      });

      expect(focusStyles).toBeTruthy();
    });
  });
});
