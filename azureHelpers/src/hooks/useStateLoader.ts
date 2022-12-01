import { useState } from "react";
import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";
import { useLoadState } from "./useLoadState";

export function useStateLoader<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    getAuthToken?: AuthTokenLoader;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
) {
  const [data, setData] = useState<StateItem<T>>({ loading: false });

  return [data, useLoadState<T>(options, setData, onChange)] as const;
}

export default useStateLoader;
