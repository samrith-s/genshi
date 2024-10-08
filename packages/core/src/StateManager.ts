export abstract class StateManager<State> {
  #state: State;
  #previousState: State[];
  #subscribers: ((state: State) => void)[] = [];

  constructor(state: State) {
    this.#state = state;
    this.#previousState = [state];
  }

  protected setState(state: State) {
    const previousState = this.state;
    this.#previousState.unshift(previousState);
    this.#state = state;
    this.#subscribers.forEach((callback) => callback(state));
  }

  protected get state() {
    return this.#state;
  }

  protected get previousState() {
    return this.#previousState[0];
  }

  public getPreviousStates() {
    return this.#previousState.slice();
  }

  public getState = () => {
    return this.#state;
  };

  public subscribe(callback: (state: State) => void) {
    const index = this.#subscribers.push(callback) - 1;
    return {
      remove: () => {
        this.#subscribers.splice(index, 1);
      },
    };
  }
}
