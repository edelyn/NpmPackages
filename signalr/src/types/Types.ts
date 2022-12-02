export type SignalREvent = {
  eventName: string;
  handler: (...args: any[]) => void;
};

export type SignalROptions = {
  defaultHubName?: string;
  url?: string;
  getAuthToken?: AuthTokenLoader;
};

export type AuthTokenLoader = () => Promise<{ token: string } | FetchError>;

export class FetchError {
  constructor(
    message: string,
    errorCode?: number | string,
    status?: number | string
  ) {
    this.message = message;
    this.errorCode = errorCode;
    this.status = status;
  }

  message: string;
  errorCode?: number | string;
  status?: number | string;
}
