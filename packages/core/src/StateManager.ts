import { IdManager } from "./IdManager";

/**
 * The `StateManager` class is the only class that should be used to interact with the state.
 * It is responsible for managing the state and notifying the subscribers when the state changes.
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended and provides the necessary methods to interact with the state.
 */
export abstract class StateManager<State> extends IdManager {
  #state: State;
  #previousStates: State[];
  #subscribers: ((state: State) => void)[] = [];

  constructor(state: State) {
    super();
    this.#state = state;
    this.#previousStates = [state];
  }

  /**
   * Set the new state. We do not provide any validation here as it is
   * the responsibility of the consumer.
   */
  protected setState(state: State) {
    this.#previousStates.unshift(this.#state);
    this.#state = state;

    /**
     * @todo(samrith-s): Find a better way to handel subscribers, maybe use a queue.
     */
    this.#subscribers.forEach((callback) => callback(state));
  }

  /**
   * We have this method separately to make it easier to access the
   * state in the classes that inherit from `StateManager`.
   *
   */
  protected get state() {
    return this.#state;
  }

  /**
   * The `getState` method is used to get the current state.
   */
  public getState = () => {
    return this.#state;
  };

  /**
   * We have this method separately to make it easier to access the
   * previous state in the classes that inherit from `StateManager`.
   *
   * It is by design that the property only returns the immediately previous state.
   * If you need to access more than one previous state, use the `getPreviousStates` method.
   */
  protected get previousState() {
    return this.#previousStates[0];
  }

  /**
   * The `getPreviousStates` returns all the previous states in the lifetime of the store.
   */
  public getPreviousStates() {
    return this.#previousStates.slice();
  }

  /**
   * Allows you to subscribe to the state changes. It returns an object with a `remove` method
   * that you can call to unsubscribe.
   */
  public subscribe(callback: (state: State) => void) {
    const index = this.#subscribers.push(callback) - 1;

    /**
     * We return an object with a `remove` method that allows the subscriber to remove itself
     * from the list of subscribers. This is a common pattern that is inspired by listeners in
     * React Native.
     *
     * It returns an object rather than a function to make it extensible. If we need to add more
     * methods in the future, we can do so without breaking the existing code.
     */
    return {
      remove: () => {
        this.#subscribers.splice(index, 1);
      },
    };
  }
}
