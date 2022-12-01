import { HubConnection } from "@microsoft/signalr";

import { useContext, useEffect, useState } from "react";
import { signalRConnector } from "../helpers/signalRConnector";
import { SignalRContext } from "../providers/SignalRProvider";
import { SignalREvent } from "../types/Types";

export type connectionStatuses = "closed" | "connecting" | "connected";

export function useSignalRConnection(props: {
  url?: string;
  hubname?: string;
  signalREvents: SignalREvent[];
  onConnectionStarted: (connection: HubConnection) => void;
}): [HubConnection | undefined, connectionStatuses] {
  const [connection, setConnection] = useState<HubConnection | undefined>();
  const [status, setStatus] = useState<connectionStatuses>("closed");

  var scopeContext = useContext(SignalRContext);

  useEffect(() => {
    var {
      url = scopeContext?.url || "",
      hubname = scopeContext?.defaultHubName || "",
      signalREvents,
      onConnectionStarted,
    } = props;
    var connect = signalRConnector(
      url,
      hubname,
      signalREvents,
      (connection) => {
        setStatus("connected");
        onConnectionStarted?.(connection);
      }
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

  useEffect(() => {
    console.log(status);
  }, [status]);

  return [connection, status];
}
