/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { LogLevel } from "@azure/msal-browser";
import { Configuration, CacheOptions } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const loadMsalConfig = (props: {
  clientId?: string;
  tenantId?: string;
  redirectUri?: string;
  maxLogLevel?: 0 | 1 | 2 | 3 | 4;
  cacheOptions?: CacheOptions;
}): Configuration => {
  const {
    clientId = "",
    tenantId = "",
    redirectUri = "",
    maxLogLevel = 0,
    cacheOptions = {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  } = props;

  return {
    auth: {
      clientId: clientId, //`${process.env.REACT_APP_AZUREAD_CLIENTID}`,
      authority: tenantId, //`${process.env.REACT_APP_AZUREAD_AUTHORITY}`,
      redirectUri: redirectUri, // `${window.location.origin}/`,
    },
    cache: cacheOptions,
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          if (level <= maxLogLevel) {
            console.error(message, level);
          }
        },
      },
    },
  };
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
// export const loginRequest = (scopes: string[]) => {
//   return {
//     scopes,
//   };
// };
