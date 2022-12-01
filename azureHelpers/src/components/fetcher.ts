import { AuthTokenLoader, FetchError } from "../types/Types";

export function fetcher<U>(props: {
  url: string;
  data?: any;
  baseUrl?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  onChange?: (event: "start" | "end" | "error", data?: U | FetchError) => void;
  getAuthToken?: AuthTokenLoader;
}) {
  const { url, data, baseUrl, method = "post", onChange, getAuthToken } = props;

  function performFetch(token?: string) {
    if (getAuthToken && !token) {
      onChange?.("error", new FetchError("No token provided"));
    }

    var fetchParams: RequestInit = {
      method: method,
      headers: !getAuthToken
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      body: data ? JSON.stringify(data) : undefined,
    };

    onChange?.("start");

    fetch(!baseUrl ? url : `${baseUrl}/${url}`, fetchParams)
      .then((response) => {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          response.json().then((result: U) => {
            onChange?.("end", result);
          });
        } else {
          onChange?.("end");
        }
      })
      .catch((e) => {
        onChange?.("error", new FetchError(e.message, e.errorCode, e.status));
      });
  }

  if (!getAuthToken) {
    performFetch();
  } else {
    getAuthToken()
      .then((authValue) => {
        if (!(authValue instanceof FetchError)) {
          performFetch(authValue.token);
        } else {
          onChange?.("error", authValue);
        }
      })
      .catch((e) => {
        console.log("fetcher: getAuthToken Error", e);
      });
  }
}

export default fetcher;
