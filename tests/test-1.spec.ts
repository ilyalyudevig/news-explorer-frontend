import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByTestId("nav-button-signin").click();
  await page.getByTestId("email-input").fill("test@test.com");
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("password-input").fill("testteste123");
  await page.getByTestId("password-input").press("Enter");
  await page
    .getByTestId("sign-in-modal")
    .getByTestId("form-submit-button")
    .click();
  await page.getByTestId("password-input").click();
  await page.getByTestId("password-input").fill("testtest123");
  await page.getByTestId("password-input").press("Enter");
  await page
    .getByTestId("sign-in-modal")
    .getByTestId("form-submit-button")
    .click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("tablet");
  await page.getByTestId("search-input").press("Enter");
  await page.getByTestId("search-button").click();
  await page
    .getByRole("article", { name: "The Next Acetaminophen Tablet" })
    .getByTestId("save-button")
    .click();
  await page.locator("li").filter({ hasText: "Saved articles" }).click();
  await page.getByTestId("delete-button").click();
  await page.getByTestId("delete-button").click();
});
