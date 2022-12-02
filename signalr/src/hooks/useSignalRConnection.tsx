import { HubConnection } from "@microsoft/signalr";

import { useContext, useEffect, useState } from "react";
import { signalRConnector } from "../helpers/signalRConnector";
import { SignalRContext } from "../providers/NAITSignalRProvider";
import { AuthTokenLoader, SignalREvent } from "../types/Types";

export type connectionStatuses = "closed" | "connecting" | "connected";

export function useSignalRConnection(props: {
  url?: string;
  hubname?: string;
  listeners?: SignalREvent[];
  onConnectionStarted?: (connection: HubConnection) => void;
  getAuthToken?: AuthTokenLoader;
}): [HubConnection | undefined, connectionStatuses] {
  const [connection, setConnection] = useState<HubConnection | undefined>();
  const [status, setStatus] = useState<connectionStatuses>("closed");

  var scopeContext = useContext(SignalRContext);

  useEffect(() => {
    var {
      url = scopeContext?.url || "",
      hubname = scopeContext?.defaultHubName || "",
      listeners = [],
      onConnectionStarted,
      getAuthToken = scopeContext?.getAuthToken,
    } = props;
    var connect = signalRConnector(
      url,
      hubname,
      listeners,
      (connection) => {
        setStatus("connected");
        onConnectionStarted?.(connection);
      },
      getAuthToken
    );

    connect.onclose(() => {
      setStatus("closed");
    });

    connect.onreconnected(() => {
      setStatus("connected");
    });
    connect.onreconnecting(() => {
      setStatus("connecting");
    });

    setConnection(connect);
  }, []);

  useEffect(() => {
    return () => {
      connection?.stop();
    };
  }, [connection]);

  return [connection, status];
}
