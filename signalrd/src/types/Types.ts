export type SignalREvent = {
  eventName: string;
  handler: (...args: any[]) => void;
};

export type SignalROptions = {
  defaultHubName?: string;
  url?: string;
};
