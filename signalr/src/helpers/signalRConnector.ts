import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import { SignalREvent } from "../types/Types";

export function signalRConnector(
  url: string,
  hubname: string,
  signalRItems: SignalREvent[],
  onConnectionStarted: (connection: HubConnection) => void
) {
  const connect = new HubConnectionBuilder()
    .withUrl(`${url}/${hubname}`, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

  connect.start().then(() => {
    signalRItems.forEach((x) => {
      connect.on(x.eventName, x.handler);
    });
    onConnectionStarted?.(connect);
  });

  return connect;
}
