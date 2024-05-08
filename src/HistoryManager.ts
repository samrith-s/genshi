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
    name?: string;
    type?: Dispatcher;
  };
};

export abstract class HistoryManager<State> extends HandlerManager<State> {
  constructor(state: State) {
    super(state);
  }

  #history: Map<symbol, History<State>> = new Map();

  protected trace(
    history: Omit<History<State>, "previousState" | "currentState">
  ) {
    const symbol = Symbol("trace");

    this.#history.set(symbol, {
      global: false,
      ...history,
    } as History<State>);

    return symbol;
  }

  protected traceEnd(symbol: symbol) {
    const trace = this.#history.get(symbol);

    if (trace) {
      const updatedTrace = {
        ...trace,
        previousState: this.previousState,
        currentState: this.state,
      };

      this.#history.set(symbol, updatedTrace);
    }
  }

  public history() {
    return [...this.#history.values()];
  }

  public printHistory() {
    console.table(
      this.history().map((history) => ({
        type: history.type,
        dispatcher: history.name,
        global: history.global,
        payload: history.payload,
        previous_state: history.previousState,
        current_state: history.currentState,
        ...(history.source
          ? {
              source_type: history.source?.type,
              source_name: history.source?.name,
            }
          : {}),
      }))
    );
  }
}
