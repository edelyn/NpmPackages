import { StateItem, useStateLoader } from "@nait-aits/usestateloader";
import useGetToken from "./useGetToken";

export function useStateLoaderAuthenticated<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: StateItem<T>) => void
) {
  const getAuthToken = useGetToken();

  return useStateLoader<T>(
    {
      ...options,
      getAuthToken,
    },
    onChange
  );
}

export default useStateLoaderAuthenticated;
