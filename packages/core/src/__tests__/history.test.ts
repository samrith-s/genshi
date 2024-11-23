import { describe, expect, it, vi } from "vitest";

import { Dispatcher } from "../Dispatchers/@BaseDispatcher";
import { HistoryManager } from "../HistoryManager";
import { Store } from "../Store";

describe("history", () => {
  it("should show mark whether the dispatch is global or not correctly", () => {
    const store = new Store(10);

    const action = store.action("increment", vi.fn());
    const effect = store.effect("log", ({ dispatch }) => {
      dispatch(action);
    });

    store.dispatch(effect);

    const history = store.history();

    store.printHistory();

    expect(history[0].name).toBe("increment");
    expect(history[0].global).false;

    expect(history[1].name).toBe("log");
    expect(history[1].global).true;
  });

  it("should warn if the trace id is not valid while ending the trace", () => {
    class History extends HistoryManager<number> {
      public startTrace() {
        return this.trace({
          type: Dispatcher.ACTION,
          name: "increment",
          payload: 1,
        });
      }

      public endTrace(id: string) {
        this.traceEnd(id);
      }
    }

    const mockWarn = vi.fn();
    vi.spyOn(console, "warn").mockImplementation(mockWarn);

    const hm = new History(10);
    const id = hm.startTrace();
    hm.endTrace(id);

    expect(mockWarn).not.toHaveBeenCalled();

    hm.endTrace("");

    expect(mockWarn).toHaveBeenCalledTimes(1);
  });
});
