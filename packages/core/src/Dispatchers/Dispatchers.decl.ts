export enum Dispatcher {
  ACTION = "action",
  EFFECT = "effect",
}

export type DispatcherSource = {
  name: string;
  type: Dispatcher;
};

export type DispatcherConfig = {
  displayName: string;
  type: Dispatcher;
  source?: DispatcherSource;
};
