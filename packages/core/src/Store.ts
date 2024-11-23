/**
 * Welcome to Hali!
 *
 * Hali is a state management library that is designed to be simple and easy to use.
 * It is inspired by the Elm architecture and Redux.
 *
 * Hali is designed to be modular and extensible. It is built on the principle of
 * composition over inheritance. This means that any new functionality added to Hali
 * should be composed by existing and new classes which follow a chain of inheritance.
 *
 * Hali follows two major terminologies in classes.
 * - Root (origin class in the list of inherited classes)
 * - Terminal (final class in the list of classes, which is exposed to the consumer)
 *
 * Between the root and terminal classes, there can be any number of intermediate classes.
 * But apart from the terminal class, all the classes are expected to be abstract.
 *
 * `IdManager` is the root class, and `Store` is the terminal class. All the classes
 * apart from the terminal class are expected to be abstract.
 *
 * All the classes between `IdManager` and `Store` are intermediate classes. If any new
 * functionality is to be added, there are three considerations:
 * 1. If the functionality is related to identity management, it should be in the `IdManager` class
 * 2. The `Store` class should be as light-weight as possible and only expose methods that are
 *  necessary for the consumer.
 * 3. Any new functionality for which an intermediary class doesn't exist, should go in its
 *  own class and be inherited by the `Store` class.
 *
 * @example
 * If we were to add a logging functionality, the we will create a `LoggerManager` class.
 * The `LoggerManager` class will be inherited by the `Store` class. And it will inherit the
 * `DispatchManager` class.
 *
 * If another class is needed between `LoggerManager` and `Store`, then it will
 * inherit the `LoggerManager` class, and so on.
 */

import { DispatchManager } from "./DispatchManager";
import { Action, ActionHandler } from "./Dispatchers/ActionDispatcher";
import { Effect, EffectHandler } from "./Dispatchers/EffectDispatcher";

/**
 * The `Store` class allows you to create a store. It is a
 * container for the state and dispatchers.
 *
 * ```ts
 * const store = new Store({ count: 0 });
 * ```
 */
export class Store<State> extends DispatchManager<State> {
  constructor(state: State, name?: string) {
    super(state);
    if (name) {
      this.setName(name);
    }
  }

  /**
   * Register an action with the store. In Hali, an Action is used to
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
   * Register an effect with the store. In Hali, an Effects is used to
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
