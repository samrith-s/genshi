import { describe, expect, it, vi } from "vitest";

import { StateManager } from "../managers/state-manager";
import { Store } from "../store";

describe("state", () => {
  it("should print state correctly", () => {
    const store = new Store(10);
    expect(store.getState()).toBe(10);
  });

  it("should not allow setting state in any way except through `setState`", () => {
    const sm = new (class extends StateManager<number> {
      public dummySetter(value: number) {
        this.state = value;
      }
    })(10);

    expect(() => sm.dummySetter(10)).toThrowError();
  });

  it("should print previous state correctly", () => {
    const store = new Store(10);
    const action = store.action("increment", ({ state }) => state + 10);

    store.dispatch(action);

    expect(store.getState()).toBe(20);
    expect(store.getPreviousStates()).toStrictEqual([10, 10]);
  });

  it("should not allow setting previous state in any way via inherited classes", () => {
    const sm = new (class extends StateManager<number> {
      public dummySetter(value: number) {
        this.previousState = value;
      }
    })(10);

    expect(() => sm.dummySetter(10)).toThrowError();
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
