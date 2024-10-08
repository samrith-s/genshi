import { describe, expect, it, vi } from "vitest";

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

    expect(history[0].name).toBe("log");
    expect(history[0].global).true;

    expect(history[1].name).toBe("increment");
    expect(history[1].global).false;
  });
});
