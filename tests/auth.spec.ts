import { test, expect } from "@playwright/test";
import { testConfig } from "./config/test-config";
import {
  loginUser,
  logoutUser,
  verifyAuthenticatedState,
  verifyUnauthenticatedState,
} from "./helpers/auth-helpers";

test.describe("User Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.baseUrl);
  });

  test("should allow a user to log in with valid credentials", async ({
    page,
  }) => {
    await loginUser(page);
    await verifyAuthenticatedState(page);
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
    await loginUser(page);
    await logoutUser(page);
    await verifyUnauthenticatedState(page);
  });
});
