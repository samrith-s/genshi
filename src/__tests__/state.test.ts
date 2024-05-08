import { describe, expect, it } from "vitest";

import { Store } from "../Store";

describe("state", () => {
  it("should print state correctly", () => {
    const store = new Store(10);
    expect(store.getState()).toBe(10);
  });

  it("should print previous state correctly", () => {
    const store = new Store(10);
    const action = store.action("increment", ({ state }) => state + 10);

    store.dispatch(action);

    expect(store.getState()).toBe(20);
    expect(store.getPreviousStates()).toStrictEqual([10, 10]);
  });
});
