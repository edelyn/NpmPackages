import { useContext } from "react";
import { fetcher } from "../components/fetcher";
import { StateLoaderConfigurationContext } from "../providers/NaitFetchStateProvider";
import { AuthTokenLoader, FetchError } from "../types/Types";

export type SendDataType = "QUERYSTRING" | "JSON" | "FORMDATA";
export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export type ChangeEventType = "start" | "end" | "error";

export type UseFetcherFetchProps<T> = {
  url: string;
  data?: any;
  excludeBaseUrl?: boolean;
  sendDataType?: SendDataType;
  method?: MethodType;
  authenticationRequired?: boolean;
  headers?: Record<string, string>;
  getAuthToken?: AuthTokenLoader;
  onChange?: (event: ChangeEventType, data: T | FetchError | undefined, headers?: Headers) => void;
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
      headers,
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
      headers,
    });

    // return () => controller.abort();
  };

  return {
    fetch: caller,
  };
}
