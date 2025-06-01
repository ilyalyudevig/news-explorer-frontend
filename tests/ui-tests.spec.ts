import { test, expect } from "@playwright/test";

test.describe("unauthorized user tests", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.removeItem("jwt");
    });

    await context.storageState({ path: "tests/states/no-token-state.json" });
    await context.close();
  });

  test.use({ storageState: "tests/states/no-token-state.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("sign in button is visible for an unauthorized user", async ({
    page,
  }) => {
    await page.getByTestId("nav-button-signin").isVisible();
  });

  test("saved articles link is not visible for an unauthorized user", async ({
    page,
  }) => {
    await page.getByTestId("nav-link-savednews").isHidden();
  });
});

test.describe("authorized user tests", () => {
  let authToken: string;

  test.beforeAll(async ({ request, browser }) => {
    const response = await request.post("http://localhost:3001/signin", {
      data: {
        email: "testuser@example.com",
        password: "testuser123",
      },
    });

    const authData = await response.json();
    authToken = authData.token;
  });

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({
      Authorization: `Bearer ${authToken}`,
    });
  });

  test("saved news link is visible", async ({ page }) => {
    await page.getByTestId("nav-link-savednews").isVisible();
  });

  test("can access /saved-news", async ({ page }) => {
    await page.goto("http://localhost:3000/saved-news");
    await page.getByTestId("saved-news-content").isVisible();
  });
});
