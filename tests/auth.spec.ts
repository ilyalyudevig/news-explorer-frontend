import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.VITE_TEST_USER_EMAIL || "test@test.com";
const TEST_PASSWORD = process.env.VITE_TEST_USER_PASSWORD || "testtest123";

// Adjust selectors and credentials as needed for your app

test.describe("User Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("should allow a user to log in with valid credentials", async ({
    page,
  }) => {
    await page.getByTestId("nav-button-signin").click();
    await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    await page.getByTestId("email-input").fill(TEST_EMAIL);
    await page.getByTestId("password-input").fill(TEST_PASSWORD);
    await page
      .getByTestId("sign-in-modal")
      .getByTestId("form-submit-button")
      .click(); // Wait for modal to close and user to be authenticated
    await expect(page.getByTestId("sign-in-modal")).toBeHidden();
    // Check for authenticated UI, e.g., logout button or saved articles link
    await expect(page.getByTestId("nav-link-savednews")).toBeVisible();
    await expect(page.getByTestId("nav-button-signout")).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.getByTestId("nav-button-signin").click();
    await expect(page.getByTestId("sign-in-modal")).toBeVisible();
    await page.getByTestId("email-input").fill("wrong@example.com");
    await page.getByTestId("password-input").fill("wrongpassword");
    await page
      .getByTestId("sign-in-modal")
      .getByTestId("form-submit-button")
      .click();
    // Expect error message to appear
    await expect(page.getByText(/invalid|incorrect|error/i)).toBeVisible();
  });

  test("should log out and return to unauthenticated state", async ({
    page,
  }) => {
    // Log in first
    await page.getByTestId("nav-button-signin").click();
    await page.getByTestId("email-input").fill(TEST_EMAIL);
    await page.getByTestId("password-input").fill(TEST_PASSWORD);
    await page
      .getByTestId("sign-in-modal")
      .getByTestId("form-submit-button")
      .click();
    await expect(page.getByTestId("nav-link-savednews")).toBeVisible();
    // Log out
    await page.getByTestId("nav-button-logout").click();
    // Check for unauthenticated UI
    await expect(page.getByTestId("nav-button-signin")).toBeVisible();
    await expect(page.getByTestId("nav-link-savednews")).toBeHidden();
  });
});
