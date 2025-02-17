import type { Dispatch } from "./dispatchers/@base-dispatcher";
import type { ActionHandler } from "./dispatchers/action-dispatcher";
import type { EffectHandler } from "./dispatchers/effect-dispatcher";

/**
 * Description of an action middleware.
 *
 * @todo(@samrith-s) Maybe harmonize this with {@link ActionHandler}?
 */
export type ActionMiddleware = <State = unknown, Payload = unknown>({
  state,
  handler,
  payload,
}: {
  state: State;
  handler: ActionHandler<State, Payload>;
  payload: Payload;
}) => State;

/**
 * Description of an effect middleware.
 *
 * @todo(@samrith-s) Maybe harmonize this with {@link EffectHandler}?
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectMiddleware = <State = any, Payload = any>({
  state,
  handler,
  payload,
}: {
  state: State;
  handler: EffectHandler<State, Payload>;
  payload: Payload;
  dispatch: Dispatch;
}) => void;

type ActionMiddlewares = ActionMiddleware[];
type EffectMiddlewares = EffectMiddleware[];

/**
 * Configuration for the Genshi store.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreConfig = {
  name?: string;
  middlewares?: {
    action?: ActionMiddlewares;
    effect?: EffectMiddlewares;
  };
};
