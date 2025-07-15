import { Page } from "@playwright/test";

/**
 * Resets the test user's state by calling the dedicated testing endpoint.
 * This should be called before each test to ensure a clean state.
 * @param page The Playwright page object.
 */
export async function resetUserState(page: Page) {
  // This function assumes you have a POST endpoint at `/testing/reset-user`
  // that handles deleting all articles for the currently authenticated user.
  const response = await page.request.post("/testing/reset-user");

  // It's a good practice to ensure the reset was successful.
  if (!response.ok()) {
    throw new Error(`Failed to reset user state: ${response.statusText()}`);
  }
}
