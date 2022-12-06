# fetch-state

These items are intended to make working with state loaded from http endpoints quicker to create and easier to work with.

## Installation

```bash
npm install @nait-aits/fetch-state
```

## Hooks and Providers

- [NaitFetchStateProvider](#naitfetchstateprovider)
- [useStateLoader](#usestateloader)
- [useLoadState](#useloadstate)
- [useEftcher](#usefetcher)

## Setup

## NaitFetchStateProvider

You can wrap your application (or specific components) in a NaitFetchStateProvider. If you don't, you won't be able to globally override default settings (baseUrl, getAuthToken, etc). You can still use these items, but they will need to be specified each call.

### App.ts (or app/component entry point)

```ts
import { NaitFetchStateProvider } from "@nait-aits/fetch-state";

function App() {
  return (
    <NaitFetchStateProvider>
      <Control />
    </NaitFetchStateProvider>
  );
}
```

### NaitFetchStateProvider config (optional)

If you have any overrides, you can specify the configuration defaults here as well. For example, you can set all endpoint calls to be POST and require authentication by default.

You only need to specify the items you are overriding/need.

For example:

```ts
<NaitFetchStateProvider
  config={{
    baseUrl: "http://google.com",
    defaultMethod: "GET",
    authenticationRequired: true,
  }}
>
  <Control />
</NaitFetchStateProvider>
```

### Configuration Defaults

- baseUrl: undefined;
- defaultMethod: "POST";
- authenticationRequired: false;
- debug: false;
- getAuthToken: undefined;

### Authorization Tokens

If your application required Auth Bearere tokens, you can set the default get token hook here. Anytime a request that requires authentication is called, this hook will be called to get the token and append it to the header.

```ts
<NaitFetchStateProvider
  config={{
    getAuthToken: useTokenHook,
  }}
>
  <Control />
</NaitFetchStateProvider>
```

### Integration with @nait-aits\azure-ad-auth

if you are using the package [@nait-aits\azure-ad-auth](../azure-ad-auth/README.md), you can easily tap into the `useGetToken` hook and all auth is take care of for you (provided it is azure ad auth)

```ts
import "./App.css";
import TestAuth from "./TestAuth";
import { NaitAzureADAuthProvider, useGetToken } from "@nait-aits/azure-ad-auth";

import { NaitFetchStateProvider } from "@nait-aits/fetch-state";

function App() {
  return (
    <NaitAzureADAuthProvider>
      <NaitFetchStateProvider
        config={{
          getAuthToken: useGetToken,
        }}
      >
        <TestAuth />
      </NaitFetchStateProvider>
    </NaitAzureADAuthProvider>
  );
}

export default App;
```

### Debug

If you are having issues, you can enable the debug panel by setting the debug value to true. This will output a div that contains the values that the provider is using.

## useStateLoader

This hook is used to call get data from an endpoint, while tracking its status (start, end, error). It has a generic type, that specifies what type the data being returned is.

```ts
var [state, loadState, setState] = useStateLoader<ReturnType>({
  url: "someUrl",
});
```

It returns an array that contains the data state (of type `StateItem<T>`), the method load the data (loading does not happen automatically), and a setter in case you want to update the state yourself (not required, but may be useful).

Unless otherwise specified, the baseUrl above will prepend the url. The only required parameter is the url.

### Usage

Here is a simple page that uses this hook.

```ts
import { useStateLoader } from "@nait-aits/fetch-state";
import { useEffect } from "react";

type Product = { name: string; id: number };
export function SamplePage() {
  //note: setProducts is shown here for demonstration purposes only.
  var [products, loadProducts, setProducts] = useStateLoader<Product[]>({
    url: `Products/GetAllProducts`,
    method: "GET",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      {products.loading && <div>Loading...</div>}
      {products.error && <div>Error: {products.error?.message}</div>}
      {products.data && (
        <div>
          {products.data.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## useLoadState

If, for whatever reason, you want to manage the start yourself, you can use useLoadState.

It is similar to useStateLoader, but you sepcify the setter. The state must be of type `StateItem<T>`.

It returns the method load the data. The only required parameter is the url.

```ts

var [data, setData] = useState<StateItem<ReturnType>>();

var loadData = useLoadState<ReturnType>({
  url: "someUrl",
}, setData);

...

loadData();
```

### Usage

Here is a simple page that uses this hook.

```ts
import { StateItem, useLoadState } from "@nait-aits/fetch-state";
import { useEffect, useState } from "react";

type Product = { name: string; id: number };

export function SamplePage() {
  var [products, setProducts] = useState<StateItem<Product[]> | undefined>(
    undefined
  );

  var loadProducts = useLoadState<Product[]>(
    {
      url: `Products/GetAllProducts`,
    },
    setProducts,
    (event, data) => {
      //here you can do something with the event and data
      if (event === "end") {
        //do something
      }
    }
  );

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      {products?.loading && <div>Loading...</div>}
      {products?.error && <div>Error: {products?.error?.message}</div>}
      {products?.data && (
        <div>
          {products.data.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## useFetcher

While the first two are useful for state based operations, there are many times you want to make one off calls, and you only care it they were processed or not (i.e. deleting a record). That is where the useFetcher hook comes into play. It allows you to call an endpoint, and then do something with its result (or not, your call).

It is a simple hook to instantiate, requiring no parameters, and returns a fetch function you can call to access an endpoint.

The only required parameter is the url, but in order to know its result, you will need to tap into the onChange parameter.

```ts
var fetcher = useFetcher();
...
fetcher.fetch<ReturnType>({
    url: someUrl,
    onChange: (event,data)=>{
        if(event === "end"){
            //do something (or not)
        }
    }
});
```

You can use the same fetcher multiple times, it is not tied to a single state/endpoint.

### Usage

Here is a simple page that uses this hook.

```ts
import { FetchError, useFetcher } from "@nait-aits/fetch-state";
import { useState } from "react";

type Product = { name: string; id: number };

export function SamplePage() {
  var fetcher = useFetcher();
  var [products, setProducts] = useState<Product[] | undefined>();

  return (
    <div>
      <button
        onClick={() => {
          fetcher.fetch<Product[]>({
            url: "Products/GetAllProducts",
            onChange: (event, data) => {
              //need to also make sure it isnt an error object
              if (event === "end" && !(data instanceof FetchError)) {
                setProducts(data);
              }
            },
          });
        }}
      >
        Load
      </button>
    </div>
  );
}
```
