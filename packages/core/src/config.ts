import type { ActionHandler } from "./dispatchers/action-dispatcher";

export type ActionMiddleware<State> = ({
  state,
  handler,
  payload,
}: {
  state: State;
  handler: ActionHandler<State, unknown>;
  payload: unknown;
}) => State;

export type StoreConfig<State> = {
  name?: string;
  middlewares?: {
    action?: ActionMiddleware<State>[];
  };
};
