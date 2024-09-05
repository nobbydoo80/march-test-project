import { useState, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (
      url: string | URL | Request,
      method = "GET",
      body: BodyInit | null = null,
      headers: HeadersInit = {},
      setLoading = true
    ) => {
      if (setLoading) setIsLoading(true);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });

        const responseData = await response.json();

        if (!response.ok) {
          return responseData;
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  return { isLoading, error, sendRequest };
};
