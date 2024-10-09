import { describe, expect, it, vi } from "vitest";

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

  it("should emit an event when state changes", () => {
    const store = new Store(10);
    const action = store.action("increment", ({ state }) => state + 10);

    const mockListener = vi.fn();

    store.subscribe(mockListener);

    expect(mockListener).toHaveBeenCalledTimes(0);

    store.dispatch(action);

    expect(mockListener).toHaveBeenCalledTimes(1);

    store.dispatch(action);

    expect(mockListener).toHaveBeenCalledTimes(2);
  });

  it("should remove state listener if removed", () => {
    const store = new Store(10);
    const action = store.action("increment", ({ state }) => state + 10);

    const mockListener = vi.fn();

    const subscription = store.subscribe(mockListener);

    expect(mockListener).toHaveBeenCalledTimes(0);

    store.dispatch(action);

    expect(mockListener).toHaveBeenCalledTimes(1);

    subscription.remove();
    store.dispatch(action);

    expect(mockListener).toHaveBeenCalledTimes(1);
  });
});
