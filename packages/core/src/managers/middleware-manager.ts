import { ActionMiddleware, EffectMiddleware, StoreConfig } from "../config";
import { Dispatch } from "../dispatchers/@base-dispatcher";
import { ActionHandler } from "../dispatchers/action-dispatcher";
import { EffectHandler } from "../dispatchers/effect-dispatcher";

import { HistoryManager } from "./history-manager";

/**
 * The `MiddlewareManager` class is responsible for managing the middlewares.
 *
 * The idea is that every kind of middleware (action or effect) will be executed
 * before the action or effect handler and in the order in which they were specified.
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended and provides the necessary methods to apply middlewares before an actual
 * user-defined action or effect handler.
 *
 * Right now there are specific functions which handle action and effect middlewares each.
 */
export abstract class MiddlewareManager<State> extends HistoryManager<State> {
  #actionMiddlewares: ActionMiddleware[] = [];
  #effectMiddlewares: EffectMiddleware[] = [];

  /**
   * A simple method to collect the middlewares from the store configuration,
   * and make them separately available for the respective apply methods.
   */
  protected collectMiddlewares(config?: StoreConfig) {
    this.#actionMiddlewares = config?.middlewares?.action ?? [];
    this.#effectMiddlewares = config?.middlewares?.effect ?? [];
  }

  /**
   * Applies all the action middlewares, in the order they were specified,
   * before the actual action handler.
   */
  protected applyActionMiddleware({
    handler,
    payload,
  }: {
    /**
     * We have to use `any` here because an action handler can
     * have any payload. We do not want to disrupt type safety
     * of the overall store.
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: ActionHandler<State, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
  }): State {
    if (this.#actionMiddlewares.length === 0) {
      return handler({
        state: this.state,
        payload,
      });
    }

    return this.#actionMiddlewares.reduce<State>(
      (acc, middleware) =>
        middleware({
          state: acc,
          payload,
          handler,
        }),
      this.state
    );
  }

  /**
   * Applies all the effect middlewares, in the order they were specified,
   * before the actual effect handler.
   */
  protected applyEffectMiddleware({
    handler,
    payload,
    dispatch,
  }: {
    /**
     * We have to use `any` here because an effect handler can
     * have any payload. We do not want to disrupt type safety
     * of the overall store.
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: EffectHandler<State, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    dispatch: Dispatch;
  }) {
    if (this.#effectMiddlewares.length === 0) {
      return handler({
        state: this.state,
        payload,
        dispatch,
      });
    } else {
      this.#effectMiddlewares.forEach((middleware) =>
        middleware({
          state: this.state,
          payload,
          dispatch,
          handler,
        })
      );
    }
  }
}
