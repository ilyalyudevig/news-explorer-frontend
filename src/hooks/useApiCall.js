import { useState } from "react";

export function useApiCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (apiFunction, args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction(args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    execute,
  };
}
