// tests/config/test-config.ts
export interface TestUserCredentials {
  email: string;
  password: string;
  name: string;
}

export interface TestConfig {
  baseUrl: string;
  user: TestUserCredentials;
  timeouts: {
    default: number;
    authentication: number;
    navigation: number;
  };
}

const TEST_ENVIRONMENTS: Record<string, TestConfig> = {
  staging: {
    baseUrl: "http://localhost:3000",
    user: {
      email: process.env.TEST_USER_EMAIL || "",
      password: process.env.TEST_USER_PASSWORD || "",
      name: process.env.TEST_USER_NAME || "",
    },
    timeouts: {
      default: 10000,
      authentication: 15000,
      navigation: 5000,
    },
  },
  development: {
    baseUrl: "http://localhost:3000",
    user: {
      email: "test@test.com",
      password: "testtest123",
      name: "John Doe",
    },
    timeouts: {
      default: 5000,
      authentication: 10000,
      navigation: 3000,
    },
  },
};

export function getTestConfig(): TestConfig {
  const environment = process.env.NODE_ENV || "development";
  const config = TEST_ENVIRONMENTS[environment];

  if (!config) {
    throw new Error(
      `No test configuration found for environment: ${environment}`
    );
  }

  // Validate staging credentials are provided
  if (environment === "staging") {
    const { email, password, name } = config.user;
    if (!email || !password || !name) {
      throw new Error(
        "Missing staging test credentials. Please set TEST_USER_EMAIL, TEST_USER_PASSWORD, and TEST_USER_NAME environment variables."
      );
    }
  }

  return config;
}

export const testConfig = getTestConfig();
