import { HubConnection } from "@microsoft/signalr";
import React from "react";
import { connectionStatuses } from "../hooks/useSignalRConnection";

export function ConnectionPanel(props: {
  connection: HubConnection | undefined;
  status: connectionStatuses;
}) {
  return (
    <div>
      <div>Connection Url: {props.connection?.baseUrl || "Not set"}</div>
      <div>Connection Status: {props.status || "Not set"}</div>
    </div>
  );
}
