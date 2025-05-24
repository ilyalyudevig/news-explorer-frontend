import { useState } from "react";

export function useApiCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const execute = async (apiFunction, args) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await apiFunction(args);
      return result;
    } catch (err) {
      setApiError(err);
      console.error("API call failed with error: ", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    execute,
    apiError,
    setApiError,
  };
}
