/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyDispatcher, Dispatcher, DispatchHandler } from "./Dispatchers";
import { StateManager } from "./StateManager";

export abstract class HandlerManager<
  State,
  Handler extends DispatchHandler,
> extends StateManager<State> {
  #dispatchers = new Set<`${Dispatcher}-${string}`>();

  #exists(dispatcher: AnyDispatcher<Handler>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    if (this.#dispatchers.has(`${type}-${name}`)) {
      console.warn(
        `The ${type} dispatcher with name '${name}' already exists in store '${this.tag}'. Setting it again will overwrite it.`
      );
    }
  }

  protected getHandler(dispatcher: AnyDispatcher<Handler>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;
    const storeId = dispatcher.storeId;

    if (this.id !== storeId) {
      const prefix = type === Dispatcher.ACTION ? "Action" : "Effect";

      throw new RangeError(
        `${prefix} '${name}' cannot be fired from store '${this.tag}'.`
      );
    }

    if (!this.#dispatchers.has(`${type}-${name}`)) {
      throw new TypeError(
        `Dispatcher ${type} ${name} is not registered with the store '${this.tag}'`
      );
    }

    return dispatcher.handler;
  }

  protected registerDispatcher(dispatcher: AnyDispatcher<Handler>) {
    this.#exists(dispatcher);
    this.#dispatchers.add(`${dispatcher.type}-${dispatcher.displayName}`);
  }
}
