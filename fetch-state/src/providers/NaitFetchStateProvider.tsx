import React, { createContext } from "react";
import { AuthTokenLoader } from "../types/Types";

type NaitFetchStateProviderConfig = {
  baseUrl?: string;
  defaultMethod?: "GET" | "POST" | "PUT" | "DELETE";
  authenticationRequired?: boolean;
  getAuthToken?: () => AuthTokenLoader;
  debug?: boolean;
};

const StateLoaderConfigurationContext = createContext<
  | {
      baseUrl?: string;
      method?: "GET" | "POST" | "PUT" | "DELETE";
      authenticationRequired?: boolean;
      getAuthToken?: AuthTokenLoader;
    }
  | undefined
>(undefined);

function NaitFetchStateProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config?: NaitFetchStateProviderConfig;
}) {
  const {
    baseUrl,
    defaultMethod = "POST",
    authenticationRequired,
    getAuthToken,
    debug,
  } = props.config || {};

  return (
    <StateLoaderConfigurationContext.Provider
      value={{
        baseUrl: baseUrl || process.env.REACT_APP_API_BASE_URL,
        method: defaultMethod,
        authenticationRequired: authenticationRequired,
        getAuthToken: getAuthToken?.(),
      }}
    >
      {debug && (
        <div>
          <h3>NaitFetchStateProvider Config</h3>
          <p>baseUrl: {baseUrl || process.env.REACT_APP_API_BASE_URL}</p>
          <p>defaultMethod: {defaultMethod}</p>
          <p>authenticationRequired: {authenticationRequired?.toString()}</p>
          <p>getAuthToken: {getAuthToken ? "Enabled" : "Not Present"}</p>
        </div>
      )}
      {props.children}
    </StateLoaderConfigurationContext.Provider>
  );
}

export { StateLoaderConfigurationContext, NaitFetchStateProvider };
