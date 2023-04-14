import { MsalProvider } from "@azure/msal-react";
import { CacheOptions, PublicClientApplication } from "@azure/msal-browser";
import { loadMsalConfig, MsalConfig } from "../helpers/loadMsalConfig";
import React, { createContext } from "react";

export const AzureADScopeContext = createContext<string[] | undefined>(
  undefined
);

type ConfigOptions = {
  /** The client Id for the azure ad app registration */
  clientId: string;

  /** The tenant id for the azure ad app registration. If specifying this do not provide signinAuthority. Omit for B2C */
  tenantId?: string;

  /** This is generally only needed for B2C. If using this, omit the tenantId.  */
  signinAuthority?: string;

  /** The redirect uri after authenticating */
  redirectUri?: string;
  maxLogLevel?: 0 | 1 | 2 | 3 | 4;
  cacheOptions?: CacheOptions;

  /** The scopes to use agains the AD if none are specified in code (i.e. api://XXX/user_login) */
  defaultScopes?: string[];

  /** known authorities, mainly useful for B2C. i.e. xxx.b2clogin.com */
  knownAuthorities?: string[];

  /** If true, will show the config in the page */
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
    signinAuthority,
    knownAuthorities,
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
    redirectUri,
    maxLogLevel,
    cacheOptions,
    knownAuthorities,
    signinAuthority:
      signinAuthority ?? "https://login.microsoftonline.com/" + tenantId,
    // b2cConfig: b2cConfig,
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
              <b>signin authority:</b> {fullConfig.signinAuthority}
            </p>
            <p>
              <b>redirectUri:</b> {fullConfig.redirectUri}
            </p>
            <p>
              <b>scopes:</b> {defaultScopes?.join(",")}
            </p>
            <p>
              <b>knownAuthorities:</b> {knownAuthorities?.join(",")}
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
