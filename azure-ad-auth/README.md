# azure-ad-auth

This package helps with the setup of react applications using azure ad authentication. By having a single provider, and supporting .env variables.

This currently does not support B2C, but that will be coming.

## Installation

```bash
npm install @nait-aits/azure-ad-auth
```

## Requirements

- @azure/msal-browser
- @azure/msal-react

## Hooks and Providers

- [NaitAzureADAuthProvider](#naitazureadauthprovider)
- [useGetToken](#usegettoken)

## Setup

To make setup simpler, you can use .env variables.

### Supported .env Variables

```
REACT_APP_AZUREAD_CLIENTID=GUID
REACT_APP_AZUREAD_TENANTID=GUID
REACT_APP_AZUREAD_SCOPES_CSV=User.Read,User.Write
```

## NaitAzureADAuthProvider

You will need to wrap your application (or specific components) in a NaitAzureADAuthProvider. This will apply the configuration.

### App.ts (or app entry point)

This will by default use the values you entered in the .env file.

```tsx
import { NaitAzureADAuthProvider } from "@nait-aits/azure-ad-auth";

function App() {
  return (
    <NaitAzureADAuthProvider>
      <Control />
    </NaitAzureADAuthProvider>
  );
}
```

### Integration with @nait-aits\fetch-state

if you are using the package [@nait-aits\fetch-state](../fetch-state/README.md), you can easily tap into the `useGetToken` hook and all auth is take care of for you.

```tsx
import "./App.css";
import TestAuth from "./TestAuth";
import { NaitAzureADAuthProvider, useGetToken } from "@nait-aits/azure-ad-auth";

import { StateLoaderConfigurationProvider } from "@nait-aits/fetch-state";

function App() {
  return (
    <NaitAzureADAuthProvider>
      <StateLoaderConfigurationProvider
        options={{
          getAuthToken: useGetToken,
        }}
      >
        <TestAuth />
      </StateLoaderConfigurationProvider>
    </NaitAzureADAuthProvider>
  );
}

export default App;
```

## Usage

You should now be at a point where everything works. Now what about logging in/out? What is the username? Are they even logged in?

To do this, you just use the azure msal items.

Here is a very simple example page.

```tsx
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

function SamplePage() {
  var { instance, accounts } = useMsal();
  var isAuthenticated = useIsAuthenticated();

  return (
    <div>
      {isAuthenticated && <div>Hello {accounts[0]?.name}</div>}
      {!isAuthenticated && <div>Please log in.</div>}
      <button
        onClick={() => {
          isAuthenticated && instance.logout();
          !isAuthenticated && instance.loginPopup();
        }}
      >
        Log {isAuthenticated ? "Out" : "In"}
      </button>
    </div>
  );
}

export default SamplePage;
```

### NaitAzureADAuthProvider config (optional)

If you have any overrides (or or not using an .env file), you can specify the configuration here as well

Only need to specify the items you are overriding/need.

For example:

```tsx
<NaitAzureADAuthProvider
  config={{
    redirectUri: `${window.location.origin}/login-complete`,
  }}
>
  <Control />
</NaitAzureADAuthProvider>
```

## useGetToken

If you ever need to get the token for a user, you can use the useGetToken hook. This will return a token, and perform any token refresh if needed.

```tsx
import { useGetToken } from "@azure/msal-react";

...

const tokenRetreiver = useGetToken();

var tokenResult = useGetToken();

if( tokenResult)


```

### Debug

If you are having issues, you can enable the debug panel by setting the debug value to true. This will output a div that contains the values that the provider is using.

### All Config values

```tsx
{
    clientId?: string;
    tenantId?: string;
    redirectUri?: string;
    maxLogLevel?: 0 | 1 | 2 | 3 | 4;
    defaultScopes?: string[];
    debug?:boolean;
    //from @azure/msal-browser
    cacheOptions?: CacheOptions;
}
```
