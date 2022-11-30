import { useState } from "react";
import { AuthTokenLoader } from "../components/fetcher";
import { loadState, StateItem } from "../components/fetchState";

export function useStateLoader<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    getAuthToken?: AuthTokenLoader;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: StateItem<T>) => void
) {
  const [data, setData] = useState<StateItem<T>>({ loading: false });

  const loader = () => {
    loadState<T>(options, setData, onChange);
  };

  return [data, loader] as const;
}

export default useStateLoader;
