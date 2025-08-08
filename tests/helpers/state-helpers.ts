import { Page } from "@playwright/test";
import { testConfig } from "../config/test-config";

const { apiBaseUrl } = testConfig;
/**
 * Resets the test user's state by calling the dedicated testing endpoint.
 * This should be called before each test to ensure a clean state.
 * @param page The Playwright page object.
 */
export async function resetUserState(page: Page) {
  const response = await page.request.post(`${apiBaseUrl}/testing/reset-user`);

  if (!response.ok()) {
    throw new Error(`Failed to reset user state: ${response.statusText()}`);
  }
}
