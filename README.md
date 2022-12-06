# React Helpers

NPM Packages to make development setup easier and hopefully end up with cleaner code. All 3 make use of providers and hooks.

## Contents

## [azure-ad-helpers ](./azure-ad-auth/README.md)

Package to make using azure AD authentication in your application easier by having a single provider and allow usage of .env variables for low effort code.

#### Sample

```html
<NaitAzureADAuthProvider 
    config={{ clientId: "GUID" }}>
  <Control />
</NaitAzureADAuthProvider>
```

## [fetch-state](./fetch-state/README.md)

Package to make fetching data easier, and also a possible replacement for redux, depending on your needs. Compatible with azure-ad-helpers by adding auth tokens to fet calls.

#### Sample

```ts
var [state, loadState, setState] = useStateLoader<ReturnType>({
  url: "someUrl",
  data: {
    name: "John",
  },
});
```

## [signalr](./signalr/README.md)

Package to make working with signalR much easier.

#### Sample

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
