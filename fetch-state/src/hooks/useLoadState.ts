import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";
import {
  ChangeEventType,
  MethodType,
  SendDataType,
  useFetcher,
} from "./useFetcher";

export type UseLoadStateOptions = {
  url: string;
  data?: any;
  excludeBaseUrl?: boolean;
  getAuthToken?: AuthTokenLoader;
  authenticationRequired?: boolean;
  keepExistingDataWhileLoading?: boolean;
  sendDataType?: SendDataType;
  method?: MethodType;
  headers?: Record<string, string>;
};

export type UseLoadStateChange<T> = (
  event: ChangeEventType,
  data: T | FetchError
) => void;

export function useLoadState<T>(
  options: UseLoadStateOptions,
  setData: React.Dispatch<React.SetStateAction<StateItem<T>>>,
  onChange?: UseLoadStateChange<T>
) {
  var fetcher = useFetcher();

  var caller = (overrides?: {
    url?: string;
    data?: any;
    sendDataType?: SendDataType;
    headers?: Record<string, string>;
    method?: MethodType;
  }) => {
    return fetcher.fetch<T>({
      ...options,
      ...overrides,
      onChange: (event, data) => {
        if (event === "start") {
          setData((prev) => {
            return options.keepExistingDataWhileLoading
              ? { ...prev, loading: true }
              : { loading: true };
          });
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
