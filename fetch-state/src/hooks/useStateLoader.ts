import { useState } from "react";
import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";
import { useLoadState } from "./useLoadState";

export function useStateLoader<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    getAuthToken?: AuthTokenLoader;
    authenticationRequired?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
) {
  const [data, setData] = useState<StateItem<T>>({ loading: false });

  return [data, useLoadState<T>(options, setData, onChange), setData] as const;
}

export default useStateLoader;
