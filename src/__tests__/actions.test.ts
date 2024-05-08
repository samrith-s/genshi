import { describe, expect, it, vi } from "vitest";

import { Store } from "../Store";
import { Action, ActionHandler } from "../Dispatchers";

describe("actions", () => {
  it("should register an action", () => {
    const store = new Store(100);
    const action = store.action("increment", vi.fn());
    expect(action).toBeInstanceOf(Action);
  });

  it("should call the action when dispatched", () => {
    const store = new Store(100);
    const mockFn = vi.fn();
    const action = store.action("decrement", mockFn);

    store.dispatch(action);

    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("should throw an error when trying to dispatch an unregistered action", () => {
    const store = new Store(10);
    const mockFn = vi.fn() as ActionHandler<number, never>;

    expect(() => store.dispatch(new Action("hello", mockFn))).toThrowError();
  });
});
