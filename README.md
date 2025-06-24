# News Explorer Frontend

[![Playwright Tests](https://github.com/ilyalyudevig/news-explorer-frontend/actions/workflows/playwright.yml/badge.svg)](https://github.com/ilyalyudevig/news-explorer-frontend/actions/workflows/playwright.yml)
[![Deploy to Production](https://github.com/ilyalyudevig/news-explorer-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/ilyalyudevig/news-explorer-frontend/actions/workflows/deploy.yml)

This is the frontend code for a [News Explorer](https://news-explorer.info), a React-based web app for searching and saving news articles by keyword, powered by the [News API](https://newsapi.org). The project implements a clean, modular architecture and follows a [Figma-based design spec](https://www.figma.com/design/3ottwMEhlBt95Dbn8dw1NH/Your-Final-Project?node-id=0-1&p=f&t=OIWocUqPQrdjeWJf-0).

## Description

News Explorer lets users search for recent news articles and save favorites to a protected area. The UI is responsive and built with reusable React components, using modern CSS and JavaScript best practices. The app is designed for maintainability and extensibility.

## Interesting Techniques

- **Custom React Hooks**: Encapsulates logic for API calls, form handling, and modal state ([React: Custom Hooks](https://react.dev/reference/react/hooks#using-the-state-hook)).
- **Protected Routes**: Uses a higher-order component to restrict access to saved articles ([React: Higher-Order Components](https://react.dev/reference/react/Component#higher-order-components)).
- **Context API**: Shares user state across components without prop drilling ([React: Context](https://react.dev/reference/react/createContext)).
- **BEM CSS Methodology**: Organizes styles for scalability ([BEM](http://getbem.com/introduction/)).
- **Playwright for E2E Testing**: Automates UI tests ([Playwright](https://playwright.dev/)).
- **Vite for Fast Builds**: Uses [Vite](https://vitejs.dev/) for rapid development and optimized production builds.
- **CSS Normalize**: Ensures cross-browser consistency ([normalize.css](https://necolas.github.io/normalize.css/)).
- **Font Loading**: Uses [Inter](https://rsms.me/inter/) and [Roboto](https://fonts.google.com/specimen/Roboto) web fonts for typography.

## Notable Technologies & Libraries

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Playwright](https://playwright.dev/)
- [normalize.css](https://necolas.github.io/normalize.css/)
- [Inter font](https://rsms.me/inter/)
- [Roboto font](https://fonts.google.com/specimen/Roboto)

## Project Structure

```text
/public
/src
  /blocks
  /components
  /contexts
  /docs
  /hooks
  /images
  /utils
  /vendor
/tests
```

- **/public**: Static assets for the app.
- **/src/blocks**: CSS modules, organized by BEM.
- **/src/components**: Reusable React components.
- **/src/contexts**: React context providers.
- **/src/docs**: Project documentation and criteria.
- **/src/hooks**: Custom React hooks.
- **/src/images**: Image assets and SVGs.
- **/src/utils**: Utility functions and API logic.
- **/src/vendor**: Third-party styles and fonts.
- **/tests**: Playwright E2E test specs and states.
