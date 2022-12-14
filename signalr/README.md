# signalr

These items are intended to make working with signalR connections and events much simpler

## Installation

```bash
npm install @nait-aits/signalR
```

## Hooks and Providers

- [NAITSignalRProvider](#naitsignalrprovider)
- [useSignalRConnection](#usesignalrconnection)

## useSignalRConnection

This hook is used to setup your connection. You will specify what events you are listening to, and their callbacks, and any action you want to perform once the connection is established. You can also specify the url, hub, get token, etc.

It returns a connection (to call actions) and the connection status (allowing you to see if you are connected, connecting, etc).

```ts
 const [connection, connectionStatus] = useSignalRConnection({
    listeners: [
      {
        eventName: "ProdcutAdded",
        handler: (productName: string) => {
          //do something
        },
      },
      ...
    ],
    onConnectionStarted: (connection) => {
      connection.invoke("OnConnected");
    },
  });
```

It returns an array that contains the data state (of type `StateItem<T>`), the method load the data (loading does not happen automatically), and a setter in case you want to update the state yourself (not required, but may be useful).

Unless otherwise specified, the url will be pulled from the provider (note above that the url and hubname were not needed as these were set by the provider).

### Usage

Here is a simple page that uses this hook.

```ts
import { useSignalRConnection } from "@nait-aits/signalr";
import { useState } from "react";

type User = {
  name: string;
  connectionId: string;
};

export function SignalR() {
  const [lastProductAdded, setLastProductAdded] = useState("");

  const [connection, connectionStatus] = useSignalRConnection({
    listeners: [
      {
        eventName: "ProdcutAdded",
        handler: (name: string) => {
          setLastProductAdded(name);
        },
      },
    ],
    onConnectionStarted: (connection) => {
      connection.invoke("OnConnect");
    },
  });

  return (
    <div>
      <div>
        <div>Connection Status: {connectionStatus}</div>
        <h2>Add Product Listener</h2>
        <div>
          {lastProductAdded && <div>Product Added{lastProductAdded}</div>}
        </div>
      </div>
    </div>
  );
}
```

### Note about the listener handlers

The listeners handlers return an (...any[]) that is of any type (or length). For each item coming back from the signalR call on the server, just add it as a parameter to the listener handler and assign the type there.

Also, on the react side, the names you give the variables does not matter, only the order.

Here is the C# server side code

```csharp
public async Task SomeHubMethod()
{
    ...

    await Clients.Caller.SendAsync("SomethingHappened", nameOfUser, productId, order);
}
```

And to handle it in react (notice the userName doesnt match the nameOfUser above)

```ts
    listeners: [
      {
        eventName: "SomethingHappened",
        handler: (userName: string, productId: number, order: Order) => {
          //dp something
        },
      },
      ...
    ]
```

## NAITSignalRProvider

You can wrap your application (or specific components) in a NAITSignalRProvider if you want to set app/component default values. If you don't, you won't be able to globally override default settings. You can still use these items, but they will need to be specified each call.

### App.ts (or app/component entry point)

```ts
import { NAITSignalRProvider } from "@nait-aits/signalr";

function App() {
  return (
    <NAITSignalRProvider>
      <Control />
    </NAITSignalRProvider>
  );
}
```

### NAITSignalRProvider config

You can set the url, default hubname, getAuthToken (for authenticated calls), or enable the debug panel.

You only need to specify the items you are overriding/need.

For example:

```ts
<NAITSignalRProvider
  config={{
    defaultHubName: "SampleHub",
    url: "https://localhost:5001/signalr",
  }}
>
  <Control />
</NAITSignalRProvider>
```

### Configuration Defaults

- url: undefined;
- defaultHubName: undefined;
- debug: false;
- getAuthToken: undefined;

### Authorization Tokens

If your application required Auth Bearere tokens, you can set the default get token hook here. Anytime a request that requires authentication is called, this hook will be called to get the token and append it to the header.

Note: Keep in mind that SignalR only sends the token on initial connection, not everytime an event is raised.

```ts
<NAITSignalRProvider
  config={{
    getAuthToken: useTokenHook,
  }}
>
  <Control />
</NAITSignalRProvider>
```

### Integration with @nait-aits\azure-ad-auth

if you are using the package [@nait-aits\azure-ad-auth](../azure-ad-auth/README.md), you can easily tap into the `useGetToken` hook and all auth is take care of for you (provided it is azure ad auth)

```ts
import "./App.css";
import TestAuth from "./TestAuth";
import { NaitAzureADAuthProvider, useGetToken } from "@nait-aits/azure-ad-auth";

import { NAITSignalRProvider } from "@nait-aits/signalr";

function App() {
  return (
    <NaitAzureADAuthProvider>
      <NAITSignalRProvider
        config={{
          getAuthToken: useGetToken,
        }}
      >
        <TestAuth />
      </NAITSignalRProvider>
    </NaitAzureADAuthProvider>
  );
}

export default App;
```

### Notes about Tokens, SignalR, and ASP.NET Authentiation

Although not directly related to this project, I thought I
would mention that there is an additional setup on the .NET
side you may need to add to get the authorization working with
SignalR hubs. This is due to the fact that the SignalR connection sends
a query parameter ("access_token") on connection, instead of the
standard auth bearer header.

Add this to the setup of the setup of your service auth setup. The below example is for azure AD authentication, but the concept is similar
for all (updating the events of the options)

```csharp

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddMicrosoftIdentityWebApi(options =>
{
  configuration.Bind("AzureAd", options);

  //This is the part you need to add
  options.Events = new JwtBearerEvents
  {
      OnMessageReceived = context => AddSignalRTokenEvent(context, "/hubs")
  };
},
options =>
{
    configuration.Bind("AzureAd", options);
});

private Task AddSignalRTokenEvent(MessageReceivedContext context, string hubUrlPrefix = "")
{
  var accessToken = context.Request.Query["access_token"];

  //if token is there and we are monitoring this path for it
  if (!string.IsNullOrEmpty(accessToken) &&
      context.HttpContext.Request.Path.StartsWithSegments(hubUrlPrefix))
  {
      context.Token = accessToken;
  }
  return Task.CompletedTask;
}

```

### Debug

If you are having issues, you can enable the debug panel by setting the debug value to true. This will output a div that contains the values that the provider is using.
