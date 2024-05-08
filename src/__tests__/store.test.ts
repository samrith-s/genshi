import { describe, expect, it, vi } from "vitest";

import { Store } from "../Store";
import { Action, Dispatcher, Effect } from "../Dispatchers";

describe("store", () => {
  it("should create store", () => {
    const store = new Store(100);
    expect(store.getState()).toBe(100);
  });

  it("should set the source properly", () => {
    const store = new Store(100);

    const source = { name: "my-effect", type: Dispatcher.EFFECT };

    const action = store.action("act", vi.fn());
    action.source(source);

    const effect = store.action("log", vi.fn());
    effect.source(source);

    expect(action.source()).toStrictEqual(source);
    expect(effect.source()).toStrictEqual(source);
  });
});
