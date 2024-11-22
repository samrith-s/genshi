import { Dispatcher } from "./Dispatchers";
import { HandlerManager } from "./HandlerManager";

export type History<State> = {
  id: string;
  timestamp: Date;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class HistoryManager<State> extends HandlerManager<State, any> {
  #history = new Map<string, History<State>>();

  protected trace(
    this: HistoryManager<State>,
    history: Omit<
      History<State>,
      "id" | "timestamp" | "previousState" | "currentState"
    >
  ) {
    const id = `trace-${this.#history.size.toString().padStart(4, "0")}`;

    this.#history.set(id, {
      id,
      global: false,
      timestamp: new Date(),
      ...history,
    } as History<State>);

    return id;
  }

  protected traceEnd(id: string) {
    const trace = this.#history.get(id);

    const updatedTrace = {
      ...trace,
      previousState: this.previousState,
      currentState: this.state,
    };

    this.#history.set(id, updatedTrace as History<State>);
  }

  public history(this: HistoryManager<State>) {
    return [...this.#history.values()].reverse();
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
