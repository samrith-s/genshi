import { HistoryManager } from "./HistoryManager";

export abstract class StateManager<State> {
  #state: State;
  #previousState: State;

  constructor(state: State) {
    this.#state = state;
    this.#previousState = state;
  }

  protected setState(state: Partial<State>) {
    const previousState = this.state;
    const nextState = {
      ...previousState,
      ...state,
    };

    this.#previousState = previousState;
    this.#state = nextState;
  }

  protected get state() {
    return { ...this.#state };
  }

  protected get previousState() {
    return { ...this.#previousState };
  }

  public getState = () => {
    return {
      ...this.#state,
    };
  };
}
