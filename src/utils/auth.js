import { backendBaseUrl as baseUrl } from "./constants";

export const register = (email, password, username) => {
  return new Promise((resolve, reject) => {
    resolve({
      user: {
        username: "John Doe",
        email: "jdoe@example.com",
        _id: "67dc82803cc720b833a37bfe",
      },
    });
  });
};

export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    resolve({ token: "dev-token" });
  });
};

export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    resolve({
      username: "Test User",
      email: "test-user@example.com",
      _id: "67dc82813cc720b833a37c00",
    });
  });
};
