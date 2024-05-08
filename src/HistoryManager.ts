import { Dispatcher } from "./Dispatchers";
import { HandlerManager } from "./HandlerManager";

export type History<State> = {
  name: string;
  type: Dispatcher;
  previousState?: State;
  currentState: State;
  payload: unknown;
  global?: boolean;
  source?: {
    name: string;
    type: Dispatcher;
  };
};

export abstract class HistoryManager<State> extends HandlerManager<State> {
  constructor(state: State) {
    super(state);
  }

  #history: History<State>[] = [];

  protected record(
    history: Omit<History<State>, "previousState" | "currentState">
  ) {
    this.#history.push({
      global: false,
      ...history,
      previousState: this.previousState as State,
      currentState: this.state as State,
    });
  }

  public history() {
    return this.#history.slice();
  }
}
