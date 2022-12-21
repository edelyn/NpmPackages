import { useState } from "react";
import { StateItem } from "../types/Types";
import {
  useLoadState,
  UseLoadStateChange,
  UseLoadStateOptions,
} from "./useLoadState";

export function useStateLoader<T>(
  options: UseLoadStateOptions,
  onChange?: UseLoadStateChange<T>
) {
  const [data, setData] = useState<StateItem<T>>({ loading: false });

  return [data, useLoadState<T>(options, setData, onChange), setData] as const;
}

export default useStateLoader;
