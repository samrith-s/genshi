import { HistoryManager } from "./HistoryManager";

export abstract class StateManager<State> {
  #state: State;
  #previousState: State[];

  constructor(state: State) {
    this.#state = state;
    this.#previousState = [state];
  }

  protected setState(state: State) {
    const previousState = this.state;
    this.#previousState.unshift(previousState);
    this.#state = state;
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
}
