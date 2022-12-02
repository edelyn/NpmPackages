import React, { createContext } from "react";
import { AuthTokenLoader } from "../types/Types";

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
  options?: {
    baseUrl?: string;
    defaultMethod?: "GET" | "POST" | "PUT" | "DELETE";
    authenticationRequired?: boolean;
    getAuthToken?: () => AuthTokenLoader;
    debug?: boolean;
  };
}) {
  const {
    baseUrl,
    defaultMethod = "POST",
    authenticationRequired,
    getAuthToken,
    debug,
  } = props.options || {};

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
          <h3>StateLoaderConfigurationContext</h3>
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
