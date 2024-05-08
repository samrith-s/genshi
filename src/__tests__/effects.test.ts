import { describe, expect, it, vi } from "vitest";

import { Store } from "../Store";
import { Effect, EffectHandler } from "../Dispatchers";

describe("effect", () => {
  it("should register an effect", () => {
    const store = new Store(100);
    const effect = store.effect("log", vi.fn());
    expect(effect).toBeInstanceOf(Effect);
  });

  it("should call the effect when dispatched", () => {
    const store = new Store(100);
    const mockFn = vi.fn();
    const effect = store.effect("log", mockFn);

    store.dispatch(effect);

    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("should throw an error when trying to dispatch an unregistered effect", () => {
    const store = new Store(10);
    const mockFn = vi.fn() as EffectHandler<number, never>;

    expect(() => store.dispatch(new Effect("hello", mockFn))).toThrowError();
  });
});
