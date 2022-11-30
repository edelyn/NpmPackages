import React, { createContext } from "react";

export const StateLoaderConfigurationContext = createContext<
  | {
      baseUrl?: string;
      method?: "GET" | "POST" | "PUT" | "DELETE";
    }
  | undefined
>(undefined);

export function StateLoaderConfigurationProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  baseUrl?: string;
  defaultMethod?: "GET" | "POST" | "PUT" | "DELETE";
}) {
  const { children, baseUrl, defaultMethod = "POST" } = props;

  return (
    <StateLoaderConfigurationContext.Provider
      value={{
        baseUrl: baseUrl || process.env.REACT_APP_API_BASE,
        method: defaultMethod,
      }}
    >
      {children}
    </StateLoaderConfigurationContext.Provider>
  );
}

export default StateLoaderConfigurationProvider;
