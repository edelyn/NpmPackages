import { fetcher, FetchError, AuthTokenLoader } from "./fetcher";

export type StateItem<T> = {
  loading: boolean;
  error?: FetchError;
  data?: T;
};

export function loadState<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    getAuthToken?: AuthTokenLoader;
  },
  setData: (data: StateItem<T>) => void,
  onChange?: (event: "start" | "end" | "error", data: StateItem<T>) => void
) {
  const {
    url,
    postData,
    excludeBaseUrl,
    method = "POST",
    getAuthToken,
  } = options;

  fetcher<T>({
    url,
    data: method === "GET" ? undefined : postData || {},
    excludeBaseUrl,
    getAuthToken,
    method,
    onChange: (event, data) => {
      if (event === "start") {
        setData({ loading: true });
      } else if (event === "end") {
        setData({ loading: false, data: data as T });
      } else if (event === "error") {
        setData({ loading: false, error: data as FetchError });
      }

      onChange?.(event, data as StateItem<T>);
    },
  });
}
