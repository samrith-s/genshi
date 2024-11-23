import { describe, expect, it, vi } from "vitest";

import { BaseDispatcher, Dispatcher } from "../Dispatchers/@BaseDispatcher";
import { Action } from "../Dispatchers/ActionDispatcher";
import { Store } from "../Store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Dummy extends BaseDispatcher<Dispatcher.ACTION, any> {}

describe("handlers", () => {
  it("should warn if an handler is already registered with the same name ", () => {
    const mockConsole = vi.spyOn(console, "warn");
    const store = new Store(10);

    store.action("increment", vi.fn());
    store.action("increment", vi.fn());

    expect(mockConsole).toHaveBeenCalled();

    mockConsole.mockReset();
  });

  it("should throw an error if an handler does not exist", () => {
    const store = new Store(10);

    expect(() =>
      store.dispatch(
        new Dummy({
          storeId: store.id,
          displayName: "hello",
          type: "hi" as Dispatcher,
          handler: undefined,
        }) as Action<number, never>
      )
    ).toThrowError(TypeError);
  });
});
