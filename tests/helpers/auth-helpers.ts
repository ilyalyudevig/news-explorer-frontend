import { Page, expect } from "@playwright/test";
import { testConfig } from "../config/test-config";

async function accessNavigation(page: Page, action: () => Promise<void>) {
  const hamburgerButton = page.getByTestId("mobile-menu-btn");

  // Check if we're in mobile layout by looking at viewport width
  const viewport = page.viewportSize();
  const isMobileLayout = viewport ? viewport.width <= 585 : false;

  if (isMobileLayout) {
    await hamburgerButton.click();
    await expect(page.getByTestId("nav-items")).toBeVisible();

    // Execute the action
    await action();
  } else {
    // Desktop layout - navigation items should already be visible
    await action();
  }
}

export async function navigateToSignIn(page: Page) {
  await accessNavigation(page, async () => {
    await expect(page.getByTestId("preloader")).not.toBeVisible();
    await page.getByTestId("nav-button-signin").click();
  });
}

export async function loginUser(page: Page) {
  await navigateToSignIn(page);
  await expect(page.getByTestId("sign-in-modal")).toBeVisible();

  await page.getByTestId("email-input").fill(testConfig.user.email);
  await page.getByTestId("password-input").fill(testConfig.user.password);
  await page
    .getByTestId("sign-in-modal")
    .getByTestId("form-submit-button")
    .click();

  // Wait for authentication to complete
  await expect(page.getByTestId("nav-link-savednews")).toBeVisible({
    timeout: testConfig.timeouts.authentication,
  });
  await expect(page.getByTestId("nav-button-signout")).toBeVisible();
}

export async function logoutUser(page: Page) {
  await accessNavigation(page, async () => {
    await page.getByTestId("nav-button-signout").click();
  });
  await expect(page.getByTestId("nav-button-signin")).toBeVisible();
  await expect(page.getByTestId("nav-link-savednews")).not.toBeVisible();
}

export async function verifyAuthenticatedState(page: Page) {
  await expect(page.getByTestId("nav-link-savednews")).toBeVisible();
  await expect(page.getByTestId("nav-button-signout")).toBeVisible();
  await expect(page.getByTestId("nav-button-signin")).not.toBeVisible();

  const userButton = page.getByTestId("nav-button-signout");
  await expect(userButton).toContainText(testConfig.user.name.split(" ")[0]);
}

export async function verifyUnauthenticatedState(page: Page) {
  await expect(page.getByTestId("nav-button-signin")).toBeVisible();
  await expect(page.getByTestId("nav-link-savednews")).not.toBeVisible();
  await expect(page.getByTestId("nav-button-signout")).not.toBeVisible();
}
