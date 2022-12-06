import { Configuration, CacheOptions } from "@azure/msal-browser";

export type MsalConfig = {
  clientId: string;
  tenantId: string;
  redirectUri?: string;
  maxLogLevel?: 0 | 1 | 2 | 3 | 4;
  cacheOptions?: CacheOptions;
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const loadMsalConfig = (props: MsalConfig): Configuration => {
  const {
    clientId = "",
    tenantId = "",
    redirectUri = "",
    maxLogLevel = 0,
    cacheOptions = {},
  } = props;

  return {
    auth: {
      clientId: clientId,
      authority: tenantId,
      redirectUri: redirectUri,
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
