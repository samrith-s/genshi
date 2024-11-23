import { Dispatcher, DispatchHandler } from "./Dispatchers/@BaseDispatcher";
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

/**
 * The `HistoryManager` class is a specialized handler
 * that is used to manage the history of the store.
 *
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended by other intermediary classes or the terminal class
 */
export abstract class HistoryManager<State> extends HandlerManager<
  State,
  DispatchHandler
> {
  #history = new Map<string, History<State>>();

  /**
   * The `trace` method is used to create a trace of the dispatch. It is the
   * primary method used to start a trace of the dispatch.
   */
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

  /**
   * The `traceEnd` method is used to end a trace of the dispatch. The only way to
   * end a trace is by calling this method with a valid trace id.
   */
  protected traceEnd(id: string) {
    const trace = this.#history.get(id);

    if (!trace) {
      console.warn(`A trace with id '${id}' does not exist.`);
      return;
    }

    const updatedTrace = {
      ...trace,
      previousState: this.previousState,
      currentState: this.state,
    };

    this.#history.set(id, updatedTrace as History<State>);
  }

  /**
   * The `history` method is used to get the history of the store. It returns a new instance
   * of the history array, so that the original history array is not mutated.
   */
  public history(this: HistoryManager<State>) {
    return [...this.#history.values()].reverse();
  }

  /**
   * Convenience method to print the history in a table format. Useful for
   * debugging.
   */
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
