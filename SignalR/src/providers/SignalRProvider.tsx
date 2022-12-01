import React, { createContext } from "react";
import { SignalROptions } from "../types/Types";

export const SignalRContext = createContext<SignalROptions | undefined>(
  undefined
);

export function SignalRProvider(props: {
  children: React.ReactNode | React.ReactNode[];
  config?: SignalROptions;
}) {
  const {
    children,
    config = {
      url: process.env.REACT_APP_SIGNALR_URL || "",
      defaultHubName: process.env.REACT_APP_SIGNALR_HUB || "",
    },
  } = props;

  return (
    <SignalRContext.Provider value={config}>{children}</SignalRContext.Provider>
  );
}

export default SignalRProvider;
