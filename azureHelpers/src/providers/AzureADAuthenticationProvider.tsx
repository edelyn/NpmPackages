import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { loadMsalConfig, MsalConfig } from "./loadMsalConfig";
import React, { createContext } from "react";

export const AzureADScopeContext = createContext<string[] | undefined>(
  undefined
);

export function AzureADAuthenticationProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config?: MsalConfig;
  defaultScopes?: string[];
}) {
  const { children, defaultScopes, config = {} } = props;

  var envScopes: string[] | undefined = process.env.REACT_APP_SCOPES
    ? process.env.REACT_APP_SCOPES.split(",")
    : undefined;

  var defaultConfig: MsalConfig = {
    clientId: `${process.env.REACT_APP_AZUREAD_CLIENTID}`,
    tenantId: `${process.env.REACT_APP_AZUREAD_AUTHORITY}`,
    redirectUri: `${window.location.origin}/`,
    maxLogLevel: 0,
    cacheOptions: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  };

  const msalInstance = new PublicClientApplication(
    loadMsalConfig({ ...defaultConfig, ...config })
  );

  return (
    <MsalProvider instance={msalInstance}>
      <AzureADScopeContext.Provider value={defaultScopes || envScopes}>
        {children}
      </AzureADScopeContext.Provider>
    </MsalProvider>
  );
}
