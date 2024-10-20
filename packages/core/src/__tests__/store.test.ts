import { describe, expect, it, vi } from "vitest";

import { Dispatcher } from "../Dispatchers";
import { Store } from "../Store";

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

  it("should throw an error if the action is not from the same store", () => {
    const store1 = new Store(100);
    const store2 = new Store(100);

    const increment1 = store1.action("increment", vi.fn());
    const increment2 = store2.action("increment", vi.fn());

    expect(() => store1.dispatch(increment1)).not.toThrow();
    expect(() => store2.dispatch(increment2)).not.toThrow();
    expect(() => store2.dispatch(increment1)).toThrow(
      `Action 'increment' cannot be fired from store '${store2.id}'`
    );

    const tick1 = store1.effect("tick", vi.fn());
    const tick2 = store2.effect("tick", vi.fn());

    expect(() => store1.dispatch(tick1)).not.toThrow();
    expect(() => store2.dispatch(tick2)).not.toThrow();
    expect(() => store2.dispatch(tick1)).toThrow(
      `Effect 'tick' cannot be fired from store '${store2.id}'`
    );
  });
});
