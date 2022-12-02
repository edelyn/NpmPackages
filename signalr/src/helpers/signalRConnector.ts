import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import { AuthTokenLoader, FetchError, SignalREvent } from "../types/Types";

export function signalRConnector(
  url: string,
  hubname: string,
  signalRItems: SignalREvent[],
  onConnectionStarted: (connection: HubConnection) => void,
  getAuthToken?: AuthTokenLoader
) {
  const connect = new HubConnectionBuilder()
    .withUrl(`${url}/${hubname}`, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: () =>
        getAuthToken?.().then((e) => {
          if (e instanceof FetchError) throw e;
          return e.token;
        }) || "",
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
