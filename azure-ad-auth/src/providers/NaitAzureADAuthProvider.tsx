import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { loadMsalConfig, MsalConfig } from "../helpers/loadMsalConfig";
import React, { createContext } from "react";

export const AzureADScopeContext = createContext<string[] | undefined>(
  undefined
);

export function NaitAzureADAuthProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config?: MsalConfig & { defaultScopes?: string[]; debug?: boolean };
}) {
  const { children, config = {} } = props;

  var envScopes: string[] | undefined = process.env.REACT_APP_AZUREAD_SCOPES_CSV
    ? process.env.REACT_APP_AZUREAD_SCOPES_CSV.split(",")
    : undefined;

  var defaultConfig: MsalConfig = {
    clientId: `${process.env.REACT_APP_AZUREAD_CLIENTID}`,
    tenantId: `${
      process.env.REACT_APP_AZUREAD_TENANTID
        ? "https://login.microsoftonline.com/" +
          process.env.REACT_APP_AZUREAD_TENANTID
        : ""
    }`,
    redirectUri: `${window.location.origin}/`,
    maxLogLevel: 0,
    cacheOptions: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };

  var fullConfig = { ...defaultConfig, ...config };

  const msalInstance = new PublicClientApplication(loadMsalConfig(fullConfig));

  return (
    <MsalProvider instance={msalInstance}>
      <AzureADScopeContext.Provider value={config.defaultScopes || envScopes}>
        {config?.debug && (
          <div>
            <h3>MsalProvider Options</h3>
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
              <b>scopes:</b> {envScopes?.join(",")}
            </p>
            <p>
              <b>maxLogLevel: </b> {fullConfig.maxLogLevel}
            </p>
            <p>
              <b>cacheLocation:</b> {fullConfig.cacheOptions?.cacheLocation} -{" "}
              {config.cacheOptions?.storeAuthStateInCookie?.toString()}
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
