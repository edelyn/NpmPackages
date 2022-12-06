import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  ITransport,
} from "@microsoft/signalr";
import { AuthTokenLoader, FetchError, SignalREvent } from "../types/Types";

export function signalRConnector(props: {
  url: string;
  hubname: string;
  listeners: SignalREvent[];
  transport?: HttpTransportType | ITransport;
  skipNegotiation?: boolean;
  onConnectionStarted: (connection: HubConnection) => void;
  getAuthToken?: AuthTokenLoader;
}) {
  const {
    url,
    hubname,
    listeners,
    skipNegotiation = true,
    transport = HttpTransportType.WebSockets,
    onConnectionStarted,
    getAuthToken,
  } = props;

  const connect = new HubConnectionBuilder()
    .withUrl(`${url}/${hubname}`, {
      skipNegotiation,
      transport,
      accessTokenFactory: () =>
        getAuthToken?.().then((e) => {
          if (e instanceof FetchError) throw e;
          return e.token;
        }) || "",
    })
    .withAutomaticReconnect()
    .build();

  connect.start().then(() => {
    listeners.forEach((x) => {
      connect.on(x.eventName, x.handler);
    });
    onConnectionStarted?.(connect);
  });

  return connect;
}
