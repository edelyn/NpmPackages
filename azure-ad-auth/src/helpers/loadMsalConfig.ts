import {
  Configuration,
  CacheOptions,
} from "@azure/msal-browser";

export type MsalConfig = {
  clientId: string;
  signinAuthority?: string;
  redirectUri?: string;
  maxLogLevel?: 0 | 1 | 2 | 3 | 4;
  cacheOptions?: CacheOptions;
  knownAuthorities?: string[];
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const loadMsalConfig = (props: MsalConfig): Configuration => {
  const {
    clientId = "",
    signinAuthority = "",
    knownAuthorities,
    redirectUri = "",
    maxLogLevel = 0,
    cacheOptions = {},
  } = props;

  return {
    auth: {
      clientId: clientId,
      authority: signinAuthority,
      redirectUri: redirectUri,
      navigateToLoginRequestUrl: false,
      knownAuthorities: knownAuthorities
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
