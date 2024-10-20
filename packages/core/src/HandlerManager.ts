/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyDispatcher, Dispatcher } from "./Dispatchers";
import { StateManager } from "./StateManager";

export abstract class HandlerManager<State> extends StateManager<State> {
  constructor(state: State) {
    super(state);
  }

  #dispatchers: Set<`${Dispatcher}-${string}`> = new Set();

  #exists(dispatcher: AnyDispatcher<State>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    if (this.#dispatchers.has(`${type}-${name}`)) {
      console.warn(
        `The ${type} dispatcher with name '${name}' already exists in store '${this.id}'. Setting it again will overwrite it.`
      );
    }
  }

  protected getHandler(dispatcher: AnyDispatcher<State>) {
    const type = dispatcher.type;
    const name = dispatcher.displayName;
    const storeId = dispatcher.storeId;

    if (this.id !== storeId) {
      const prefix = type === Dispatcher.ACTION ? "Action" : "Effect";

      throw new RangeError(
        `${prefix} '${name}' cannot be fired from store '${this.id}'.`
      );
    }

    if (!this.#dispatchers.has(`${type}-${name}`)) {
      throw new TypeError(
        `Dispatcher ${type} ${name} is not registered with the store '${this.id}'`
      );
    }

    return dispatcher.handler;
  }

  protected registerDispatcher(dispatcher: AnyDispatcher<State>) {
    this.#exists(dispatcher);
    this.#dispatchers.add(`${dispatcher.type}-${dispatcher.displayName}`);
  }
}
