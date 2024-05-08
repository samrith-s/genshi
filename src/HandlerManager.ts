import { Action, AnyDispatcher, Dispatcher, Effect } from "./Dispatchers";
import { StateManager } from "./StateManager";

export abstract class HandlerManager<State> extends StateManager<State> {
  constructor(state: State) {
    super(state);
  }

  #actions: Map<string, Action<State, any>> = new Map();
  #effects: Map<string, Effect<State, any>> = new Map();

  #exists(
    map: Map<string, AnyDispatcher<State>>,
    name: string,
    type: Dispatcher
  ) {
    const exists = map.has(name);

    if (exists) {
      console.warn(
        `The ${type} dispatcher already exists. Setting it again will overwrite it.`
      );
    }

    return exists;
  }

  protected getHandler(type: Dispatcher, name: string) {
    switch (type) {
      case Dispatcher.ACTION: {
        if (this.#actions.has(name)) {
          return this.#actions.get(name)?.handler;
        }

        return null;
      }

      case Dispatcher.EFFECT: {
        if (this.#effects.has(name)) {
          return this.#effects.get(name)?.handler;
        }

        return null;
      }

      default: {
        throw new Error(
          `No ${type} dispatcher named '${name}' registered with store.`
        );
      }
    }
  }

  protected registerAction(dispatcher: Action<State, any>) {
    this.#exists(this.#actions, dispatcher.displayName, dispatcher.type);
    this.#actions.set(dispatcher.displayName, dispatcher);
  }

  protected registerEffect(dispatcher: Effect<State, any>) {
    this.#exists(this.#effects, dispatcher.displayName, dispatcher.type);
    this.#effects.set(dispatcher.displayName, dispatcher);
  }
}
