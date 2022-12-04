import { useState } from "react";
import { AuthTokenLoader, FetchError, StateItem } from "../types/Types";
import { useLoadState } from "./useLoadState";

type UseStateLoaderProps = {
  url: string;
  data?: any;
  excludeBaseUrl?: boolean;
  getAuthToken?: AuthTokenLoader;
  authenticationRequired?: boolean;
  sendDataType?: "QUERYSTRING" | "JSON" | "FORMDATA";
  method?: "GET" | "POST" | "PUT" | "DELETE";
};

export function useStateLoader<T>(
  options: UseStateLoaderProps,
  onChange?: (event: "start" | "end" | "error", data: T | FetchError) => void
) {
  const [data, setData] = useState<StateItem<T>>({ loading: false });

  return [data, useLoadState<T>(options, setData, onChange), setData] as const;
}

export default useStateLoader;
