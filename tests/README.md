# End-to-End Tests (Playwright)

This directory contains the end-to-end (E2E) test suite for the News Explorer application, implemented using [Playwright](https://playwright.dev/). These tests simulate real user interactions in a browser to verify the application's functionality, responsiveness, and overall user experience.

## Table of Contents

- [How to Run Tests](#how-to-run-tests)
- [Project Structure](#project-structure)
  - [Test Suites](#test-suites)
  - [Configuration Files](#configuration-files)
  - [Fixtures](#fixtures)
  - [Helper Files](#helper-files)
  - [Test States](#test-states)
- [Test Suite Descriptions](#test-suite-descriptions)
  - [`auth.spec.ts`](#authspects)
  - [`authenticated-user.spec.ts`](#authenticated-userspects)
  - [`news-search.spec.ts`](#news-searchspects)
  - [`mobile.spec.ts`](#mobilespects)
  - [`tablet.spec.ts`](#tabletspects)

---

## How to Run Tests

To execute the entire test suite, run the following command from the project root:

```bash
npx playwright test
```

To run tests for a specific device or in a specific browser, you can use Playwright's command-line options. For example:

```bash
# Run all tests on mobile Safari
npx playwright test --project="Mobile Safari"

# Run a single test file
npx playwright test tests/auth.spec.ts
```

## Project Structure

The `tests/` directory is organized to separate test suites, configuration, and reusable helper functions.

### Test Suites

These are the main test files, each focusing on a specific area of the application.

- `auth.spec.ts`: Handles user authentication flows.
- `authenticated-user.spec.ts`: Covers features exclusive to logged-in users.
- `news-search.spec.ts`: Tests the core news search and results display.
- `mobile.spec.ts`: Contains tests specifically for mobile viewport responsiveness and interactions.
- `tablet.spec.ts`: Contains tests for tablet-specific layouts and functionality.

### Configuration Files

- `config/test-config.ts`: Provides centralized configuration for the tests, including the base URL, test user credentials, and environment-specific settings (e.g., `development` vs. `staging`).
- `config/mobile-tablet-config.ts`: Defines a comprehensive set of constants and configurations for responsive testing, including device viewport dimensions, user agents, performance budgets, and accessibility requirements for various mobile and tablet devices.

### Fixtures

- `fixtures/resetUserFixture.ts`: Defines an automatic `resetUser` fixture that runs before each test. This fixture calls a dedicated API endpoint (`/testing/reset-user`) to reset the test user's data on the backend, ensuring that each test runs in a clean, isolated environment.

### Helper Files

To avoid code duplication and improve readability, common actions are abstracted into helper functions.

- `helpers/auth-helpers.ts`: Contains reusable functions for common authentication tasks like `loginUser`, `logoutUser`, and verifying UI states (`verifyAuthenticatedState`, `verifyUnauthenticatedState`).
- `helpers/mobile-tablet-helpers.ts`: Provides utilities for responsive testing, such as opening the mobile navigation, verifying touch target sizes, and simulating device-specific interactions.
- `helpers/state-helpers.ts`: Includes functions for programmatically managing application state, such as `resetUserState`, which can be called manually within tests to reset the user's data.

### Test States

- `states/no-token-state.json`: A saved browser state file used by Playwright to run tests from an unauthenticated state without having to log out manually in each test.

---

## Test Suite Descriptions

### `auth.spec.ts`

This suite focuses on the user authentication process.

- **Login**: Verifies that a registered user can successfully log in with valid credentials.
- **Invalid Login**: Ensures that an appropriate error message is displayed when a user tries to log in with incorrect credentials.
- **Logout**: Confirms that a logged-in user can successfully log out, returning the application to its unauthenticated state.

### `authenticated-user.spec.ts`

This suite tests features that are only available to authenticated users. It relies on the `resetUser` fixture to ensure a consistent state for each test.

- **Authenticated State**: Verifies that the navigation and UI correctly reflect an authenticated user's status (e.g., showing a "Saved articles" link and a logout button with the user's name).
- **Article Bookmarking**: Tests the ability to bookmark and unbookmark articles from the search results.
- **Saved Articles Management**:
  - Verifies that bookmarked articles appear on the "Saved articles" page.
  - Confirms that the header correctly displays the total count of saved articles.
  - Tests the functionality of deleting a saved article.
- **State Persistence**: Ensures that saved articles persist across navigation between the home page and the saved articles page.

### `news-search.spec.ts`

This suite covers the core news search functionality available to all users.

- **Homepage Display**: Verifies that the main page loads correctly with the search form, header, and footer.
- **Perform Search**: Tests the search functionality by entering a query, executing the search, and verifying that results are displayed correctly.
- **Unauthenticated Bookmarking**: Ensures that an unauthenticated user who tries to bookmark an article is prompted with a tooltip asking them to sign in.
- **Search State Persistence**: Verifies that search results are preserved when navigating back to the homepage via the logo.

### `mobile.spec.ts`

This suite ensures the application is fully responsive and functional on mobile viewports, using the "iPhone SE" device profile for testing.

- **Layout & Responsiveness**:
  - Verifies the mobile layout, including the presence of the hamburger menu.
  - Ensures search results are displayed in a single-column, mobile-friendly format.
  - Checks that the layout adapts correctly to orientation changes (portrait and landscape).
- **Mobile Navigation**:
  - Tests the opening, closing, and functionality of the hamburger navigation menu.
  - Verifies navigation for both authenticated and unauthenticated users.
- **Forms & Modals**:
  - Ensures that modals (Sign In, Sign Up) are displayed correctly and are usable on small screens.
  - Tests form input behavior, including the handling of the virtual keyboard.
- **Visual Regression**: Includes screenshot tests to catch unintended visual changes on the mobile homepage, search results, and modals.

### `tablet.spec.ts`

This suite is dedicated to testing the user experience on tablet devices, using the "iPad Pro" device profile.

- **Layout & Responsiveness**:
  - Verifies that the tablet layout displays a full navigation bar instead of a hamburger menu.
  - Ensures that search results are displayed in a grid layout suitable for larger screens.
  - Tests layout adaptation to portrait and landscape orientations.
- **Tablet Navigation**:
  - Confirms that all navigation links are visible and functional.
  - Tests hover effects on interactive elements.
- **Forms & Modals**:
  - Verifies that modals are optimally sized and centered for tablet screens.
  - Tests keyboard navigation (`Tab`, `Escape`) within modals.
- **Content Interaction**:
  - Tests that search interactions and article cards are optimized for touch and viewing on a tablet.
- **Visual Regression**: Includes screenshot tests for the tablet homepage, search results, and modals to ensure visual consistency.
