import { Page, expect } from "@playwright/test";

/**
 * Mobile and tablet testing utilities
 */

export interface ViewportSize {
  width: number;
  height: number;
}

export interface DeviceConfig {
  width: number;
  height: number;
  name: string;
  isMobile: boolean;
}

export const MOBILE_VIEWPORTS = {
  iPhoneSE: { width: 375, height: 667 },
  iPhone12: { width: 390, height: 844 },
  iPhone12Pro: { width: 390, height: 844 },
  iPhone13Pro: { width: 390, height: 844 },
  iPhoneXR: { width: 414, height: 896 },
  galaxyS20: { width: 360, height: 800 },
  pixelXL: { width: 411, height: 731 },
} as const;

export const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  mobile: { width: 375, height: 667, name: "iPhone SE", isMobile: true },
  tablet: { width: 768, height: 1024, name: "iPad", isMobile: false },
  largeMobile: { width: 414, height: 896, name: "iPhone 11", isMobile: true },
  largeTablet: { width: 1024, height: 1366, name: "iPad Pro", isMobile: false },
};

export const TABLET_VIEWPORTS = {
  iPad: { width: 768, height: 1024 },
  iPadAir: { width: 820, height: 1180 },
  iPadPro: { width: 1024, height: 1366 },
  surfacePro: { width: 912, height: 1368 },
  galaxyTab: { width: 800, height: 1280 },
} as const;

export const DESKTOP_VIEWPORTS = {
  laptop: { width: 1366, height: 768 },
  desktop: { width: 1920, height: 1080 },
  widescreen: { width: 2560, height: 1440 },
} as const;

/**
 * Determines if a viewport size is considered mobile
 */
export function isMobileViewport(viewport: ViewportSize): boolean {
  return viewport.width < 768;
}

/**
 * Determines if a viewport size is considered tablet
 */
export function isTabletViewport(viewport: ViewportSize): boolean {
  return viewport.width >= 768 && viewport.width < 1024;
}

/**
 * Determines if a viewport size is considered desktop
 */
export function isDesktopViewport(viewport: ViewportSize): boolean {
  return viewport.width >= 1024;
}

/**
 * Opens mobile navigation menu if on mobile viewport
 */
export async function openMobileMenuIfNeeded(page: Page): Promise<void> {
  const viewportSize = page.viewportSize();
  if (!viewportSize || !isMobileViewport(viewportSize)) {
    return;
  }

  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  const hamburgerButton = navigation.getByRole("button").first();

  // Check if menu is already open by looking for visible menu items
  const homeMenuItem = page.getByRole("menuitem", { name: "Home" });
  const isMenuOpen = await homeMenuItem.isVisible();

  if (!isMenuOpen) {
    await hamburgerButton.click();
    await expect(homeMenuItem).toBeVisible();
  }
}

/**
 * Closes mobile navigation menu if open
 */
export async function closeMobileMenuIfOpen(page: Page): Promise<void> {
  const viewportSize = page.viewportSize();
  if (!viewportSize || !isMobileViewport(viewportSize)) {
    return;
  }

  const homeMenuItem = page.getByRole("menuitem", { name: "Home" });
  const isMenuOpen = await homeMenuItem.isVisible();

  if (isMenuOpen) {
    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    const hamburgerButton = navigation.getByRole("button").first();
    await hamburgerButton.click();
    await expect(homeMenuItem).not.toBeVisible();
  }
}

/**
 * Verifies that touch targets meet minimum size requirements
 * iOS: 44x44px, Android: 48x48dp (we use 44px as minimum)
 */
export async function verifyTouchTargetSize(
  page: Page,
  locator: any,
  minSize: number = 44
): Promise<void> {
  const boundingBox = await locator.boundingBox();
  expect(boundingBox).toBeTruthy();
  expect(boundingBox!.width).toBeGreaterThanOrEqual(minSize);
  expect(boundingBox!.height).toBeGreaterThanOrEqual(minSize);
}

/**
 * Verifies there's no horizontal scroll on the page
 */
export async function verifyNoHorizontalScroll(
  page: Page,
  tolerance: number = 10
): Promise<void> {
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + tolerance);
}

/**
 * Simulates a tap gesture (for mobile testing)
 */
export async function tapElement(page: Page, locator: any): Promise<void> {
  const viewportSize = page.viewportSize();
  if (viewportSize && isMobileViewport(viewportSize)) {
    await locator.tap();
  } else {
    await locator.click();
  }
}

/**
 * Tests keyboard navigation through a set of elements
 */
export async function testKeyboardNavigation(
  page: Page,
  expectedFocusableElements: string[]
): Promise<void> {
  for (let i = 0; i < expectedFocusableElements.length; i++) {
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // If we have specific selectors, verify the correct element is focused
    if (expectedFocusableElements[i]) {
      await expect(page.locator(expectedFocusableElements[i])).toBeFocused();
    }
  }
}

/**
 * Verifies modal fits within viewport bounds
 */
export async function verifyModalFitsViewport(
  page: Page,
  modalLocator: any
): Promise<void> {
  const modalRect = await modalLocator.boundingBox();
  const viewportSize = page.viewportSize();

  expect(modalRect).toBeTruthy();
  expect(viewportSize).toBeTruthy();

  // Modal should not exceed 95% of viewport width/height
  expect(modalRect!.width).toBeLessThanOrEqual(viewportSize!.width * 0.95);
  expect(modalRect!.height).toBeLessThanOrEqual(viewportSize!.height * 0.95);

  // Modal should be positioned within viewport
  expect(modalRect!.x).toBeGreaterThanOrEqual(0);
  expect(modalRect!.y).toBeGreaterThanOrEqual(0);
  expect(modalRect!.x + modalRect!.width).toBeLessThanOrEqual(
    viewportSize!.width
  );
  expect(modalRect!.y + modalRect!.height).toBeLessThanOrEqual(
    viewportSize!.height
  );
}

/**
 * Verifies text is readable (not truncated or overlapping)
 */
export async function verifyTextReadability(
  page: Page,
  textLocator: any
): Promise<void> {
  await expect(textLocator).toBeVisible();

  const textRect = await textLocator.boundingBox();
  expect(textRect).toBeTruthy();
  expect(textRect!.width).toBeGreaterThan(0);
  expect(textRect!.height).toBeGreaterThan(0);
}

/**
 * Tests form input behavior with virtual keyboard simulation
 */
export async function testFormInputWithVirtualKeyboard(
  page: Page,
  inputLocator: any,
  testValue: string
): Promise<void> {
  await inputLocator.click();
  await expect(inputLocator).toBeFocused();

  // Simulate typing with virtual keyboard (slower than regular typing)
  await inputLocator.fill(testValue);
  await expect(inputLocator).toHaveValue(testValue);

  // Test that input remains visible and accessible
  await expect(inputLocator).toBeVisible();
}

/**
 * Verifies images load and display properly on different screen densities
 */
export async function verifyImageLoading(
  page: Page,
  imageLocator: any
): Promise<void> {
  await expect(imageLocator).toBeVisible();

  // Wait for image to load
  await page.waitForFunction(
    (img) => img.complete && img.naturalHeight !== 0,
    await imageLocator.elementHandle()
  );

  const imageRect = await imageLocator.boundingBox();
  expect(imageRect).toBeTruthy();
  expect(imageRect!.width).toBeGreaterThan(0);
  expect(imageRect!.height).toBeGreaterThan(0);
}

/**
 * Tests swipe gesture simulation (for mobile carousels, etc.)
 */
export async function simulateSwipe(
  page: Page,
  element: any,
  direction: "left" | "right" | "up" | "down",
  distance: number = 100
): Promise<void> {
  const box = await element.boundingBox();
  if (!box) throw new Error("Element not found for swipe");

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  let endX = startX;
  let endY = startY;

  switch (direction) {
    case "left":
      endX = startX - distance;
      break;
    case "right":
      endX = startX + distance;
      break;
    case "up":
      endY = startY - distance;
      break;
    case "down":
      endY = startY + distance;
      break;
  }

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY);
  await page.mouse.up();
}

/**
 * Verifies page performance metrics
 */
export async function verifyPagePerformance(
  page: Page,
  maxLoadTime: number = 3000
): Promise<void> {
  const performanceMetrics = await page.evaluate(() => {
    const timing = performance.timing;
    return {
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint:
        performance
          .getEntriesByType("paint")
          .find((entry) => entry.name === "first-paint")?.startTime || 0,
      firstContentfulPaint:
        performance
          .getEntriesByType("paint")
          .find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0,
    };
  });

  expect(performanceMetrics.domContentLoaded).toBeLessThan(maxLoadTime);
  expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);
}

/**
 * Screenshots for visual regression testing with device-specific naming
 */
export async function takeDeviceScreenshot(
  page: Page,
  name: string,
  options: { fullPage?: boolean } = {}
): Promise<void> {
  const viewportSize = page.viewportSize();
  if (!viewportSize) return;

  let deviceType = "desktop";
  if (isMobileViewport(viewportSize)) {
    deviceType = "mobile";
  } else if (isTabletViewport(viewportSize)) {
    deviceType = "tablet";
  }

  const filename = `${deviceType}-${viewportSize.width}x${viewportSize.height}-${name}.png`;

  await page.screenshot({
    path: `test-results/${filename}`,
    ...options,
  });
}

/**
 * Utility to run tests across multiple viewports
 */
export function testAcrossViewports(
  viewports: Record<string, ViewportSize>,
  testFn: (viewportName: string, viewport: ViewportSize) => void
): void {
  Object.entries(viewports).forEach(([name, viewport]) => {
    testFn(name, viewport);
  });
}

/**
 * Verifies accessibility features work across devices
 */
export async function verifyAccessibilityFeatures(page: Page): Promise<void> {
  // Check for proper heading hierarchy
  const h1Elements = await page.getByRole("heading", { level: 1 }).count();
  expect(h1Elements).toBeGreaterThan(0);

  // Check for navigation landmarks
  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  // Check for proper form labels
  const inputs = page.locator(
    'input[type="text"], input[type="email"], input[type="password"]'
  );
  const inputCount = await inputs.count();

  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const hasLabel = await input.evaluate((el) => {
      if (!(el instanceof HTMLInputElement)) {
        return false;
      }
      return (
        (el.labels && el.labels.length > 0) ||
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby")
      );
    });
    expect(hasLabel).toBeTruthy();
  }
}

/**
 * Tests network conditions simulation for mobile
 */
export async function simulateSlowNetwork(page: Page): Promise<void> {
  // Simulate slow 3G connection
  await page.route("**/*", (route) => {
    setTimeout(() => route.continue(), 100); // Add 100ms delay
  });
}

/**
 * Clean up network simulation
 */
export async function clearNetworkSimulation(page: Page): Promise<void> {
  await page.unroute("**/*");
}

/**
 * Set up the page for a specific device configuration
 */
export async function setupDevice(page: Page, deviceConfig: DeviceConfig) {
  await page.setViewportSize({
    width: deviceConfig.width,
    height: deviceConfig.height,
  });

  // Set appropriate user agent if needed for more realistic testing
  const context = page.context();
  if (deviceConfig.isMobile) {
    await context.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    });
  } else {
    await context.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    });
  }
}

/**
 * Open navigation menu - handles both mobile hamburger and tablet direct access
 */
export async function openNavigation(page: Page, deviceConfig: DeviceConfig) {
  if (deviceConfig.isMobile) {
    // Mobile: click hamburger menu
    const hamburgerButton = page
      .getByRole("navigation", {
        name: "Main navigation",
      })
      .getByRole("button")
      .first();

    await hamburgerButton.click();
    await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
  } else {
    // Tablet: navigation should already be visible
    await expect(page.getByRole("menuitem", { name: "Home" })).toBeVisible();
  }
}

/**
 * Close navigation menu - handles both mobile and tablet
 */
export async function closeNavigation(page: Page, deviceConfig: DeviceConfig) {
  if (deviceConfig.isMobile) {
    // Mobile: click hamburger menu again to close
    const hamburgerButton = page
      .getByRole("navigation", {
        name: "Main navigation",
      })
      .getByRole("button")
      .first();

    await hamburgerButton.click();
    await expect(
      page.getByRole("menuitem", { name: "Home" })
    ).not.toBeVisible();
  }
  // Tablet: navigation stays visible, no action needed
}

/**
 * Open sign-in modal with device-appropriate navigation
 */
export async function openSignInModal(page: Page, deviceConfig: DeviceConfig) {
  await openNavigation(page, deviceConfig);
  await page.getByTestId("nav-button-signin").click();
  await expect(page.getByTestId("sign-in-modal")).toBeVisible();
}

/**
 * Perform search with device-appropriate interaction
 */
export async function performSearch(
  page: Page,
  query: string,
  deviceConfig: DeviceConfig
) {
  // Close navigation menu if it's open on mobile
  if (deviceConfig.isMobile) {
    const hamburgerButton = page
      .getByRole("navigation", {
        name: "Main navigation",
      })
      .getByRole("button")
      .first();

    const isMenuOpen = await page
      .getByRole("menuitem", { name: "Home" })
      .isVisible();
    if (isMenuOpen) {
      await hamburgerButton.click();
      await expect(
        page.getByRole("menuitem", { name: "Home" })
      ).not.toBeVisible();
    }
  }

  const searchInput = page.getByTestId("search-input");
  const searchButton = page.getByTestId("search-button");

  await searchInput.fill(query);
  await searchButton.click();

  await expect(
    page.getByRole("region", { name: "Search results" })
  ).toBeVisible();
}

/**
 * Verify touch target sizes meet accessibility guidelines
 */
export async function verifyTouchTargets(
  page: Page,
  selector: string,
  minSize: number = 44
) {
  const elements = page.locator(selector);
  const count = await elements.count();

  for (let i = 0; i < count; i++) {
    const element = elements.nth(i);
    const boundingBox = await element.boundingBox();

    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(minSize);
      expect(boundingBox.height).toBeGreaterThanOrEqual(minSize);
    }
  }
}

/**
 * Test modal behavior with focus trapping
 */
export async function testModalFocusTrap(page: Page, modalSelector: string) {
  const modal = page.locator(modalSelector);
  await expect(modal).toBeVisible();

  // Get all focusable elements within modal
  const focusableElements = await modal
    .locator(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    .count();

  expect(focusableElements).toBeGreaterThan(0);

  // Tab through modal elements
  for (let i = 0; i < focusableElements + 2; i++) {
    await page.keyboard.press("Tab");

    // Verify focus stays within modal
    const focusWithinModal = await page.evaluate((selector) => {
      const modal = document.querySelector(selector);
      const activeElement = document.activeElement;
      return modal?.contains(activeElement) || false;
    }, modalSelector);

    expect(focusWithinModal).toBe(true);
  }
}

/**
 * Take screenshots for visual regression testing
 */
export async function takeDeviceScreenshots(
  page: Page,
  testName: string,
  deviceConfig: DeviceConfig,
  options: {
    fullPage?: boolean;
    clip?: { x: number; y: number; width: number; height: number };
  } = {}
) {
  const filename = `${testName}-${deviceConfig.name
    .toLowerCase()
    .replace(/\s+/g, "-")}.png`;

  await page.screenshot({
    path: `test-results/${filename}`,
    fullPage: options.fullPage || false,
    clip: options.clip,
  });

  return filename;
}
