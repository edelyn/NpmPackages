import React, { createContext } from "react";
import { AuthTokenLoader, SignalROptions } from "../types/Types";

export const SignalRContext = createContext<SignalROptions | undefined>(
  undefined
);

export function NAITSignalRProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config?: {
    debug?: boolean;
    getAuthToken?: () => AuthTokenLoader;
    defaultHubName?: string;
    url?: string;
  };
}) {
  const { children, config = {} } = props;

  var newConfig: SignalROptions = {
    url: process.env.REACT_APP_SIGNALR_URL || "",
    defaultHubName: process.env.REACT_APP_SIGNALR_HUB || "",
    getAuthToken: config.getAuthToken?.(),
  };

  return (
    <SignalRContext.Provider value={newConfig}>
      {props.config?.debug && (
        <div>
          <h3>NAITSignalRProvider Config</h3>
          <p>url: {newConfig.url}</p>
          <p>defaultHubName: {newConfig.defaultHubName}</p>
        </div>
      )}
      {children}
    </SignalRContext.Provider>
  );
}

export default NAITSignalRProvider;
