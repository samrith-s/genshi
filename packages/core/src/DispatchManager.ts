import {
  Dispatch,
  Dispatcher,
  DispatchHandler,
} from "./Dispatchers/@BaseDispatcher";
import { ActionHandler } from "./Dispatchers/ActionDispatcher";
import { EffectHandler } from "./Dispatchers/EffectDispatcher";
import { HistoryManager } from "./HistoryManager";

/**
 * The `DispatchManager` class manages the various dispatchers (Actions, Effects)
 * registered with the store.
 *
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended by the `Store` class.
 */
export abstract class DispatchManager<State> extends HistoryManager<State> {
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

    const handler = this.getHandler(dispatcher) as DispatchHandler;

    const isGlobal = !dispatcher.parent;

    /**
     * Since `DispatchManager` extends `@HistoryManager`, we use the `trace`
     * method to create a trace of the dispatch.
     */
    const trace = this.trace({
      global: isGlobal,
      name,
      type,
      payload,
      ...(!isGlobal
        ? {
            source: {
              name: dispatcher.parent?.displayName,
              type: dispatcher.parent?.type,
            },
          }
        : {}),
    });

    switch (type) {
      case Dispatcher.ACTION: {
        /**
         * We are typecasting the handler as an `ActionHandler` so that
         * we get the correct type for the arguments it accepts.
         */
        const actionHandler = handler as ActionHandler<State, typeof payload>;

        this.setState(
          actionHandler({
            state: this.getState(),
            payload,
          })
        );

        this.traceEnd(trace);

        break;
      }

      case Dispatcher.EFFECT: {
        /**
         * We are typecasting the handler as an `EffectHandler` so that
         * we get the correct type for the arguments it accepts.
         */
        const effectHandler = handler as EffectHandler<State, typeof payload>;

        this.traceEnd(trace);

        effectHandler({
          state: this.state,
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
