import { useContext } from "react";
import { fetcher } from "../components/fetcher";
import { StateLoaderConfigurationContext } from "../providers/StateLoaderConfigurationProvider";
import { AuthTokenLoader, FetchError } from "../types/Types";

export function useFetcher<T>() {
  const baseStateContext = useContext(StateLoaderConfigurationContext);

  const caller = (options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    getAuthToken?: AuthTokenLoader;
    authenticationRequired?: boolean;
    onChange?: (
      event: "start" | "end" | "error",
      data: T | FetchError | undefined
    ) => void;
  }) => {
    const {
      url,
      postData,
      excludeBaseUrl,
      method = baseStateContext?.method || "POST",
      getAuthToken = baseStateContext?.getAuthToken,
      authenticationRequired = baseStateContext?.authenticationRequired,
    } = options;
    
    fetcher<T>({
      url,
      data: method === "GET" ? undefined : postData || {},
      baseUrl: excludeBaseUrl ? undefined : baseStateContext?.baseUrl,
      getAuthToken: authenticationRequired ? getAuthToken : undefined,
      method,
      onChange: options.onChange,
    });
  };

  return caller;
}
