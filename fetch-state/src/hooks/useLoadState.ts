import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";
import { useFetcher } from "./useFetcher";

export function useLoadState<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    getAuthToken?: AuthTokenLoader;
    authenticationRequired?: boolean;
  },
  setData: (data: StateItem<T>) => void,
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
) {
  var fetcher = useFetcher();

  var caller = () => {
    return fetcher.fetch<T>({
      ...options,
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
