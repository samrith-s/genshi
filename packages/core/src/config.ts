import type { ActionHandler } from "./dispatchers/action-dispatcher";

/**
 * Description of an action middleware.
 *
 * @todo(@samrith-s) Maybe harmonize this with {@link ActionHandler}?
 */
export type ActionMiddleware = ({
  state,
  handler,
  payload,
}: {
  state: unknown;
  handler: ActionHandler<unknown, unknown>;
  payload: unknown;
}) => unknown;

export type StoreConfig = {
  name?: string;
  middlewares?: {
    action?: ActionMiddleware[];
  };
};
