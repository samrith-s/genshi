/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyDispatcher,
  Dispatcher,
  DispatchHandler,
} from "./Dispatchers/@BaseDispatcher";
import { StateManager } from "./StateManager";

/**
 * The `HandlerManager` class manages the various dispatchers (Actions, Effects)
 * registered with the store.
 *
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended by other intermediary classes or the terminal class.
 */
export abstract class HandlerManager<
  State,
  Handler extends DispatchHandler,
> extends StateManager<State> {
  #dispatchers = new Set<`${Dispatcher}-${string}`>();

  /**
   * The `#exists` method is used to check if a dispatcher with the same name
   * already exists in the store.
   */
  #exists(dispatcher: AnyDispatcher<Handler>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    if (this.#dispatchers.has(`${type}-${name}`)) {
      /**
       * We are only warning here as it is possible that the consumer is
       * intentionally overwriting the dispatcher. This is a rare case and
       * should be avoided.
       *
       * @todo(@samrith-s): See if we can turn this into an actual error behind a flag.
       */
      console.warn(
        `The ${type} dispatcher with name '${name}' already exists in store '${this.tag}'. Setting it again will overwrite it.`
      );
    }
  }

  /**
   * The `getHandler` method is used to get the handler for the dispatcher.
   * It checks if the dispatcher is registered with the store and if it is
   * allowed to be fired from the store.
   *
   * @todo (samrith-s) Evaluate moving this to where the dispatcher is actually fired
   * rather than when the handler is fetched.
   */
  protected getHandler(dispatcher: AnyDispatcher<Handler>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;
    const storeId = dispatcher.storeId;

    /**
     * This check is to ensure that the dispatcher is not fired from a store
     * that it is not registered with.
     *
     * This is a runtime check and will throw an error in production as well. The
     * expectation is that the consumer will consume this error and fix it in their
     * codebase.
     *
     * Why is this here? Consider an example with two stores `StoreA` and `StoreB`.
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

    /**
     * This check is to ensure that the dispatcher is registered with the store.
     * The error thrown here is an expected behaviour and the expectation is that
     * the consumer will consume this error and fix it in their codebase.
     */
    if (!this.#dispatchers.has(`${type}-${name}`)) {
      throw new TypeError(
        `Dispatcher ${type} ${name} is not registered with the store '${this.tag}'`
      );
    }

    return dispatcher.handler;
  }

  /**
   * Register a dispatcher with the store. This method is used to register
   * both actions and effects with the store.
   *
   * It performs an intrinsic non-blocking check to see if the dispatcher is already registered.
   */
  protected registerDispatcher(dispatcher: AnyDispatcher<Handler>) {
    this.#exists(dispatcher);
    this.#dispatchers.add(`${dispatcher.type}-${dispatcher.displayName}`);
    return dispatcher;
  }
}
