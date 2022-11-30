import { MsalProvider } from "@azure/msal-react";
import React from "react";
import { msalInstance } from "./instance";

export function AuthenticationProvider(props: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <MsalProvider instance={msalInstance}>{props.children}</MsalProvider>;
}
