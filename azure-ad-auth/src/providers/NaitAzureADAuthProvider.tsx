import { MsalProvider } from "@azure/msal-react";
import { CacheOptions, PublicClientApplication } from "@azure/msal-browser";
import { loadMsalConfig, MsalConfig } from "../helpers/loadMsalConfig";
import React, { createContext } from "react";

export const AzureADScopeContext = createContext<string[] | undefined>(
  undefined
);

type ConfigOptions = {
  clientId: string;
  tenantId: string;
  redirectUri?: string;
  maxLogLevel?: 0 | 1 | 2 | 3 | 4;
  cacheOptions?: CacheOptions;
  defaultScopes?: string[];
  debug?: boolean;
};

export function NaitAzureADAuthProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config: ConfigOptions;
}) {
  const { children, config } = props;

  const {
    clientId,
    tenantId,
    redirectUri = `${window.location.origin}/`,
    maxLogLevel = 0,
    cacheOptions = {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    defaultScopes = [],
    debug,
  } = config;
  var fullConfig: MsalConfig = {
    clientId,
    tenantId: "https://login.microsoftonline.com/" + tenantId,
    redirectUri,
    maxLogLevel,
    cacheOptions,
  };

  const msalInstance = new PublicClientApplication(loadMsalConfig(fullConfig));

  return (
    <MsalProvider instance={msalInstance}>
      <AzureADScopeContext.Provider value={defaultScopes}>
        {debug && (
          <div>
            <h3>NaitAzureADAuthProvider Config</h3>
            <p>
              <b>clientId:</b> {fullConfig.clientId}
            </p>
            <p>
              <b>tenantId:</b> {fullConfig.tenantId}
            </p>
            <p>
              <b>redirectUri:</b> {fullConfig.redirectUri}
            </p>
            <p>
              <b>scopes:</b> {defaultScopes?.join(",")}
            </p>
            <p>
              <b>maxLogLevel: </b> {fullConfig.maxLogLevel}
            </p>
            <p>
              <b>cacheLocation:</b> {fullConfig.cacheOptions?.cacheLocation} -{" "}
              {cacheOptions?.storeAuthStateInCookie?.toString()}
            </p>
            <p>
              <b>storeAuthStateInCookie:</b>{" "}
              {fullConfig.cacheOptions?.storeAuthStateInCookie?.toString()}
            </p>
          </div>
        )}
        {children}
      </AzureADScopeContext.Provider>
    </MsalProvider>
  );
}

export default NaitAzureADAuthProvider;
