import { test as base } from "@playwright/test";

export const test = base.extend<{ resetUser: void }>({
  resetUser: [
    async ({ page }, use) => {
      const stagingServerUrl = process.env.STAGING_SERVER_URL;
      if (!stagingServerUrl) {
        throw new Error("STAGING_SERVER_URL environment variable is not set.");
      }
      console.log("Resetting user and database state...");
      try {
        const response = await fetch(`${stagingServerUrl}/testing/reset-user`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`Failed to reset user: ${response.statusText}`);
        }
        console.log("User and database state reset successfully.");
      } catch (error) {
        console.error("Error resetting user and database state:", error);
        throw error; // Re-throw to fail the test if reset fails
      }
      await use();
    },
    { auto: true },
  ],
});
