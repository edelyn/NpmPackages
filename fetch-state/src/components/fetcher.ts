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
  onChange?: (event: "start" | "end" | "error", data?: U | FetchError) => void;
  getAuthToken?: AuthTokenLoader;
}) {
  const {
    url,
    data,
    baseUrl,
    method = "post",
    sendDataType = "JSON",
    onChange,
    getAuthToken,
  } = props;

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

    var fetchParams: RequestInit = {
      method: method,
      headers: !getAuthToken
        ? { "Content-Type": "application/json" }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      body: body,
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
