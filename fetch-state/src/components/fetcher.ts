import { AuthTokenLoader, FetchError } from "../types/Types";
import {
  convertModelToFormData,
  objectToQueryString,
} from "./postDataConverters";

export function fetcher<U>(props: {
  url: string;
  data?: any;
  baseUrl?: string;
  sendDataType?: "QUERYSTRING" | "JSON" | "FORMDATA";
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  abortSignal?: AbortSignal;
  onChange?: (
    event: "start" | "end" | "error",
    data?: U | FetchError,
    headers?: Headers
  ) => void;
  getAuthToken?: AuthTokenLoader;
}) {
  const {
    url,
    data,
    baseUrl,
    method = "post",
    sendDataType = "JSON",
    headers,
    onChange,
    getAuthToken,
  } = props;

  const controller = new AbortController();
  var abortSignal = controller.signal;

  function performFetch(token?: string) {
    if (getAuthToken && !token) {
      onChange?.("error", new FetchError("No token provided"));
    }
    var body: any = undefined;
    var queryString = "";

    if (sendDataType === "FORMDATA" && data) {
      var formData = new FormData();
      convertModelToFormData(data, formData);
      body = formData;
    } else if (sendDataType === "JSON" && data) {
      body = JSON.stringify(data);
    } else if (sendDataType === "QUERYSTRING" && data) {
      queryString = objectToQueryString(data);
      if (queryString) {
        //do we append to existing query or not?
        if (url.indexOf("?") > -1) {
          queryString = "&" + queryString;
        } else {
          queryString = "?" + queryString;
        }
      }
    }

    var fetchHeaders: HeadersInit = { "Content-Type": "application/json" };

    //add token if present
    if (getAuthToken) {
      fetchHeaders = { ...fetchHeaders, Authorization: `Bearer ${token}` };
    }

    //add headers if present
    if (headers) {
      Object.keys(headers).forEach((key) => {
        fetchHeaders = { ...fetchHeaders, [key]: headers[key] };
      });
    }

    var fetchParams: RequestInit = {
      method: method,
      headers: fetchHeaders,
      body: body,
      signal: abortSignal,
    };

    onChange?.("start");

    fetch(!baseUrl ? url : `${baseUrl}/${url}${queryString}`, fetchParams)
      .then((response) => {
        if (!response.ok) {
          onChange?.(
            "error",
            new FetchError(
              response.statusText,
              response.status,
              response.status
            )
          );

          return;
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          response.json().then((result: U) => {
            onChange?.("end", result, response.headers);
          });
        } else {
          onChange?.("end", undefined, response.headers);
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

  return () => {
    controller.abort();
  };
}

export default fetcher;
