export type ErrorHandlerOptions = {
  onError?: (err: unknown, instance: any, info: string) => void;
  showDialog?: boolean;
  formatError?: (err: unknown) => string;
};
