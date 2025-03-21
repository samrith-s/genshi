import {
  Dispatch,
  Dispatcher,
  DispatchHandler,
} from "../dispatchers/@base-dispatcher";

import { MiddlewareManager } from "./middleware-manager";

/**
 * The `DispatchManager` class manages the various dispatchers (Actions, Effects)
 * registered with the store.
 *
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended by the `Store` class.
 */
export abstract class DispatchManager<State> extends MiddlewareManager<State> {
  /**
   * The `dispatch` method is used to dispatch an action or an effect.
   */
  public dispatch: Dispatch = (dispatcher, ...args) => {
    /**
     * We are accessing the payload by the index,
     * because it is possible that a dispatcher might
     * not have a payload.
     */
    const payload = args[0];
    const type = dispatcher.type;
    const name = dispatcher.displayName;
    const storeId = dispatcher.storeId;
    const isGlobal = !dispatcher.parent;

    /**
     * This check is to ensure that the dispatcher is not fired from a store
     * that it is not registered with.
     *
     * This is a runtime check and will throw an error in production as well. The
     * expectation is that the consumer will consume this error and fix it in their
     * codebase.
     *
     * Why is this needed? Consider an example with two stores `StoreA` and `StoreB`.
     * and an action `increment` that is registered with both `StoreA` and `StoreB`. This check
     * will ensure that `increment` registered with `StoreA` is only fired from `StoreA`, thus
     * preventing any side-effects that might occur if a wrong action is fired from wrong store.
     */
    if (this.id !== storeId) {
      const prefix = type === Dispatcher.ACTION ? "Action" : "Effect";

      throw new RangeError(
        `${prefix} '${name}' cannot be fired from store '${this.tag}'.`
      );
    }

    const handler = this.getHandler(dispatcher) as DispatchHandler;

    /**
     * Since `DispatchManager` extends `HistoryManager`, we use the `trace`
     * method to create a trace of the dispatch.
     */
    const trace = this.trace({
      name,
      type,
      payload,
      ...(!isGlobal
        ? {
            global: false,
            source: {
              name: dispatcher.parent?.displayName,
              type: dispatcher.parent?.type,
            },
          }
        : {
            global: true,
          }),
    });

    switch (type) {
      case Dispatcher.ACTION: {
        this.setState(
          this.applyActionMiddleware({
            handler,
            payload,
          })
        );

        this.traceEnd(trace);

        break;
      }

      case Dispatcher.EFFECT: {
        this.traceEnd(trace);

        this.applyEffectMiddleware({
          handler,
          payload,
          dispatch: (...argv) => {
            const d = argv[0];
            d.parent = dispatcher;

            this.dispatch(...argv);
          },
        });

        break;
      }
    }
  };
}
