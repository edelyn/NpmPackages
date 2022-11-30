import { StateItem, useStateLoader } from "@nait-aits/usestateloader";
import { getToken } from "../helpers/getToken";

export function useStateLoaderAuthenticated<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: StateItem<T>) => void
) {
  return useStateLoader<T>(
    {
      ...options,
      getAuthToken: getToken,
    },
    onChange
  );
}

export default useStateLoaderAuthenticated;
