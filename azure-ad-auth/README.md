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

## Setup

### Supported .env Variables

```
REACT_APP_AZUREAD_CLIENTID=GUID
REACT_APP_AZUREAD_TENANTID=GUID
REACT_APP_AZUREAD_SCOPES_CSV=User.Read,User.Write
```

### App.ts (or app entry point)

This will by default use the values you entered in the .env file.

```ts
import { AzureADAuthenticationProvider } from "@nait-aits/azure-ad-auth";

function App() {
  return (
    <AzureADAuthenticationProvider>
      <Control />
    </AzureADAuthenticationProvider>
  );
}
```

## Usage

You should not be at a point where everything works. Now what about logging in/out? What is the username? Are they even logged in?

To do this, you just use the azure msal items.

Here is a very simple example page.

```ts
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

### AzureADAuthenticationProvider config (optional)

If you have any overrides (or or not using an .env file), you can specify the configuration here as well

Only need to specify the items you are overriding/need.

For example:

```ts
<AzureADAuthenticationProvider
  config={{
    redirectUri: `${window.location.origin}/login-complete`,
  }}
>
  <Control />
</AzureADAuthenticationProvider>
```

### Config values

```ts
{
    clientId?: string;
    tenantId?: string;
    redirectUri?: string;
    maxLogLevel?: 0 | 1 | 2 | 3 | 4;
    //from @azure/msal-browser
    cacheOptions?: CacheOptions;
    defaultScopes?: string[];
}
```
