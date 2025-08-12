# News Explorer Frontend Development Guidelines

Welcome to the News Explorer Frontend team! This document will help you get up to speed with our project structure, development practices, and workflows.

## Project Overview

News Explorer is a React-based web application that allows users to search for recent news articles by keyword and save their favorites to a protected area. The UI is fully responsive and follows modern CSS and JavaScript best practices.

### Key Features

- News search functionality with keyword filtering
- User authentication (login/register)
- Saved articles management
- Responsive design for all device sizes
- End-to-end testing with Playwright

## Technology Stack

- **Framework**: React 19 with Hooks
- **Routing**: React Router v7
- **Build Tool**: Vite 6
- **Language**: JavaScript (ES2020+)
- **Styling**: CSS with BEM methodology
- **Testing**: Playwright for E2E testing
- **Linting**: ESLint with React Hooks plugin
- **Package Manager**: npm

## Project Structure

```txt
news-explorer-frontend/
├── public/                 # Static assets
├── src/
│   ├── blocks/             # CSS modules organized by BEM
│   ├── components/         # Reusable React components
│   ├── contexts/           # React context providers
│   ├── docs/               # Project documentation
│   ├── hooks/              # Custom React hooks
│   ├── images/             # Image assets and SVGs
│   ├── utils/              # Utility functions and API logic
│   ├── vendor/             # Third-party styles and fonts
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── tests/                  # Playwright E2E tests
├── dist/                   # Production build output
└── ...
```

## Development Workflow

### Prerequisites

- Node.js (latest LTS version)
- npm (comes with Node.js)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ilyalyudevig/news-explorer-frontend.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables:

   ```txt
   VITE_NEWS_API_KEY=your_news_api_key
   ```

### Development Commands

| Command           | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Starts the development server with hot reloading (opens in browser) |
| `npm start`       | Starts the development server without opening browser               |
| `npm run staging` | Runs the app in staging mode                                        |
| `npm run build`   | Builds the app for production                                       |
| `npm run preview` | Previews the production build locally                               |
| `npm run lint`    | Runs ESLint to check for code issues                                |

### Testing Commands

| Command                               | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `npm test`                            | Runs all Playwright tests                 |
| `npm run test:staging-desktop-chrome` | Runs desktop tests on staging environment |
| `npm run test:staging-mobile`         | Runs mobile tests on staging environment  |
| `npm run test:staging-tablet`         | Runs tablet tests on staging environment  |
| `npm run test:ui`                     | Runs tests with Playwright UI             |
| `npm run test:debug`                  | Runs tests in debug mode                  |
| `npm run test:headed`                 | Runs tests in headed mode                 |

## Code Standards

### JavaScript/React

1. **Component Structure**:

   - Use functional components with hooks
   - Follow the order: imports, component logic, JSX
   - Use descriptive variable and function names
   - Keep components small and focused

2. **State Management**:

   - Use React Context API for global state (see `CurrentUserContext`)
   - Use custom hooks for reusable logic (see `hooks/` directory)
   - Prefer `useCallback` for functions passed as props

3. **API Integration**:
   - Use the custom `useApiCall` hook for API requests
   - Handle loading states and errors appropriately
   - Centralize API endpoints in `utils/` directory

### CSS/Styling

1. **BEM Methodology**:

   - Use Block\_\_Element--Modifier naming convention
   - Each component has its own CSS file in `src/blocks/`
   - Avoid deep nesting and specificity

2. **Responsive Design**:
   - Use CSS media queries for responsive breakpoints
   - Mobile-first approach
   - Test on multiple device sizes

### Git Workflow

1. **Branching**:

   - Create feature branches from `main`
   - Use descriptive branch names (e.g., `feature/user-authentication`)

2. **Commits**:

   - Write clear, concise commit messages
   - Follow conventional commit format when possible
   - Make small, focused commits

3. **Pull Requests**:
   - Create PRs against `main` branch
   - Ensure all tests pass before requesting review
   - Include a clear description of changes

## Architecture Patterns

### Component Structure

Components follow this pattern:

```jsx
import React from "react";
import "./component.css";

function Component({ prop1, prop2 }) {
  // Component logic here

  return (
    // JSX here
  );
}

export default Component;
```

### Custom Hooks

We use custom hooks to encapsulate reusable logic:

```javascript
import { useState } from "react";

export function useCustomHook() {
  const [state, setState] = useState(initialValue);

  const handler = () => {
    // Logic here
  };

  return { state, handler };
}
```

### Context API

Global state is managed through React Context:

- `CurrentUserContext` manages user authentication and saved articles
- Components can access context with the `useCurrentUser` hook

## Testing Strategy

We use Playwright for end-to-end testing with the following approach:

1. **Test Organization**:

   - Tests are organized by functionality (`auth.spec.ts`, `news-search.spec.ts`)
   - Device-specific tests in `mobile.spec.ts` and `tablet.spec.ts`

2. **Test Environment**:

   - Development environment for local testing
   - Staging environment for CI/CD pipeline

3. **Best Practices**:
   - Use page object models for complex interactions
   - Test both happy paths and error cases
   - Use appropriate timeouts for async operations

## Deployment

The application is automatically deployed to production via GitHub Actions when changes are merged to the `main` branch.

For manual deployment:

1. Run `npm run build` to create production build
2. The `dist/` folder contains all necessary files for deployment

## Useful Resources

- [Figma Design Spec](https://www.figma.com/design/3ottwMEhlBt95Dbn8dw1NH/Your-Final-Project?node-id=0-1&p=f&t=OIWocUqPQrdjeWJf-0)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Playwright Documentation](https://playwright.dev/)

## Getting Help

If you need help:

1. Check existing code for similar patterns
2. Review the documentation in `src/docs/`
3. Ask your team members for guidance
4. Open an issue on GitHub if you find a bug

## Common Tasks

### Adding a New Component

1. Create a new file in `src/components/`
2. Create corresponding CSS file in `src/blocks/`
3. Implement the component logic
4. Export the component
5. Import and use in parent components

### Adding a New Utility Function

1. Create or update a file in `src/utils/`
2. Implement the function
3. Export the function
4. Import and use in components/hooks

### Adding a New Route

1. Update `src/components/App.jsx` with new route
2. Create the component for the new route
3. Implement necessary logic and styling

Happy coding!
