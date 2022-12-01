import { FetchError } from "../types/Types";
import useGetToken from "./useGetToken";
import useStateLoader from "./useStateLoader";

export function useStateLoaderAuthenticated<T>(
  options: {
    url: string;
    postData?: any;
    excludeBaseUrl?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  },
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
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
