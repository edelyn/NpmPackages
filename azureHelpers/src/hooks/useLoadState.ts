import { useContext } from "react";
import { fetcher } from "../components/fetcher";
import { StateLoaderConfigurationContext } from "../providers/StateLoaderConfigurationProvider";
import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";

export function useLoadState<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    getAuthToken?: AuthTokenLoader;
  },
  setData: (data: StateItem<T>) => void,
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
) {
  const baseStateContext = useContext(StateLoaderConfigurationContext);

  const caller = () => {
    const {
      url,
      postData,
      excludeBaseUrl,
      method = baseStateContext?.method || "POST",
      getAuthToken,
    } = options;

    fetcher<T>({
      url,
      data: method === "GET" ? undefined : postData || {},
      baseUrl: excludeBaseUrl ? undefined : baseStateContext?.baseUrl,
      getAuthToken,
      method,
      onChange: (event, data) => {
        if (event === "start") {
          setData({ loading: true });
        } else if (event === "end") {
          setData({ loading: false, data: data as T });
        } else if (event === "error") {
          setData({ loading: false, error: data as FetchError });
          onChange?.(event, data as FetchError);
          return;
        }

        onChange?.(event, data as T);
      },
    });
  };

  return caller;
}
