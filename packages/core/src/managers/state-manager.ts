import { ConfigManager } from "./config-manager";

/**
 * The `StateManager` class is the only class that should be used to interact with the state.
 * It is responsible for managing the state and notifying the subscribers when the state changes.
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended and provides the necessary methods to interact with the state.
 */
export abstract class StateManager<State> extends ConfigManager<State> {
  /**
   * Only mutate this directly within `setState` method. Otherwise
   */
  #state: State;
  #previousStates: State[];
  #subscribers: ((state: State) => void)[] = [];

  constructor(state: State) {
    super();
    this.#state = state;
    this.#previousStates = [state];
  }

  /**
   * We have this property separately to make it easier to access the
   * state in the classes that inherit `StateManager`.
   */
  protected get state() {
    return this.getState();
  }

  /**
   * Never allow setting state directly via this property. It should only be
   * mutated via the `setState` method to ensure any optimisations or features
   * we might add while updating state will be centrally managed.
   */
  protected set state(_value: State) {
    throw new Error(
      "You cannot set the state directly. Use the `setState` method instead."
    );
  }

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
   * Never allow setting previous state directly. It is populated internally as
   * a side effect of setting the state.
   */
  protected set previousState(_value: State) {
    throw new Error(
      "You cannot set the previous state directly. It is managed internally."
    );
  }

  /**
   * Set the new state. We do not provide any validation here as it is
   * the responsibility of the consumer.
   */
  protected setState(state: State) {
    this.#previousStates.unshift(Object.seal(this.#state));
    this.#state = state;

    /**
     * @todo(samrith-s): Find a better way to handel subscribers, maybe use a queue.
     */
    this.#subscribers.forEach((callback) => callback(state));
  }

  /**
   * The `getState` method is used to get the current state.
   */
  public getState() {
    /**
     * Always returning a sealed object to prevent accidental mutation.
     *
     * @todo(samrith-s): Is this really necessary?
     */
    return this.#state;
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
