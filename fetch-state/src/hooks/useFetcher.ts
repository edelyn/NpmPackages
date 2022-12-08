import { useContext } from "react";
import { fetcher } from "../components/fetcher";
import { StateLoaderConfigurationContext } from "../providers/NaitFetchStateProvider";
import { AuthTokenLoader, FetchError } from "../types/Types";

export type UseFetcherFetchProps<T> = {
  url: string;
  data?: any;
  excludeBaseUrl?: boolean;
  sendDataType?: "QUERYSTRING" | "JSON" | "FORMDATA";
  method?: "GET" | "POST" | "PUT" | "DELETE";
  getAuthToken?: AuthTokenLoader;
  authenticationRequired?: boolean;
  onChange?: (
    event: "start" | "end" | "error",
    data: T | FetchError | undefined
  ) => void;
};

export function useFetcher() {
  const baseStateContext = useContext(StateLoaderConfigurationContext);

  const caller = <T>(options: UseFetcherFetchProps<T>) => {
    const {
      url,
      data,
      excludeBaseUrl,
      sendDataType,
      method = baseStateContext?.method || "POST",
      getAuthToken = baseStateContext?.getAuthToken,
      authenticationRequired = baseStateContext?.authenticationRequired,
    } = options;

    const controller = new AbortController();

    const signal = controller.signal;

    return fetcher<T>({
      url,
      data: method === "GET" ? undefined : data || {},
      sendDataType,
      baseUrl: excludeBaseUrl ? undefined : baseStateContext?.baseUrl,
      getAuthToken: authenticationRequired ? getAuthToken : undefined,
      method,
      onChange: options.onChange,
      abortSignal: signal,
    });

    // return () => controller.abort();
  };

  return {
    fetch: caller,
  };
}
