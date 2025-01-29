/**
 * Welcome to Genshi!
 *
 * Genshi is a state management library that is designed to be simple and easy to use.
 * It is inspired by the Elm architecture and Redux.
 *
 * Genshi is designed to be modular and extensible. It is built on the principle of
 * composition over inheritance. This means that any new functionality added to Genshi
 * should be composed by existing and new classes which follow a chain of inheritance.
 *
 * Genshi follows two major terminologies in classes.
 * - Root (origin class in the list of inherited classes)
 * - Terminal (final class in the list of classes, which is exposed to the consumer)
 *
 * Between the root and terminal classes, there can be any number of intermediate classes.
 * But apart from the terminal class, all the classes are expected to be abstract.
 *
 * `ConfigManager` is the root class, and `Store` is the terminal class. All the classes
 * apart from the terminal class are expected to be abstract.
 *
 * All the classes between `ConfigManager` and `Store` are intermediate classes. If any new
 * functionality is to be added, there are three considerations:
 * 1. If the functionality is related to config management, it should be in the `ConfigManager` class
 * 2. The `Store` class should be as light-weight as possible and only expose methods that are
 *  necessary for the consumer.
 * 3. Any new functionality for which an intermediary class doesn't exist, should go in its
 *  own class and can reside anywhere between the terminal and root classes, provided no other
 *  functionality of the other intermediary classes break.
 *
 * @example
 * If we were to add a logging functionality, the we will create a `LoggerManager` class.
 * The `LoggerManager` class will be inherited by the `Store` class. And it will inherit the
 * `DispatchManager` class.
 *
 * If another class is needed between `LoggerManager` and `Store`, then it will
 * inherit the `LoggerManager` class, and so on.
 */

import { StoreConfig } from "./config";
import { Action, ActionHandler } from "./dispatchers/action-dispatcher";
import { Effect, EffectHandler } from "./dispatchers/effect-dispatcher";
import { DispatchManager } from "./managers/dispatch-manager";

/**
 * The `Store` class allows you to create a store. It is a
 * container for the state and dispatchers.
 *
 * ```ts
 * const store = new Store({ count: 0 });
 * ```
 */
export class Store<State> extends DispatchManager<State> {
  constructor(state: State, config?: StoreConfig) {
    super(state);
    this.setConfig(config || {});
  }

  /**
   * Register an action with the store. In Genshi, an Action is used to
   * update the state.
   *
   * ```ts
   * const store = new Store({ count: 0 });
   *
   * const increment = store.action('increment', ({ state }) => ({
   *  ...state,
   *  count: state.count + 1
   * }));
   *
   * store.dispatch(increment);
   * ```
   */
  public action<Payload = never>(
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    return this.registerDispatcher(
      new Action<State, Payload>(this.id, name, handler)
    );
  }

  /**
   * Register an effect with the store. In Genshi, an Effects is used to
   * perform side effects like API calls, logging, etc.
   *
   * ```ts
   * const store = new Store({ count: 0 });
   *
   * const tick = store.effect('tick', ({ state }) => {
   *  setInterval(() => {
   *   console.log(state.count);
   *  }, 1000)
   * });
   *
   * store.dispatch(tick);
   * ```
   */
  public effect<Payload = never>(
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    return this.registerDispatcher(
      new Effect<State, Payload>(this.id, name, handler)
    );
  }
}
