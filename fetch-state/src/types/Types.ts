export type StateItem<T> = {
  loading: boolean;
  error?: FetchError;
  data?: T;
};

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

export type AuthTokenLoader = () => Promise<{ token: string } | FetchError>;
