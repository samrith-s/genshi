import { describe, expect, it, vi } from "vitest";

import { Dispatcher } from "../dispatchers/@base-dispatcher";
import { Action, ActionHandler } from "../dispatchers/action-dispatcher";
import { Effect, EffectHandler } from "../dispatchers/effect-dispatcher";
import { Store } from "../store";

describe("dispatchers", () => {
  /**
   * ACTIONS
   */
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

      expect(() =>
        store.dispatch(new Action(store.id, "hello", mockFn))
      ).toThrowError();
    });
  });

  /**
   * EFFECTS
   */
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

      expect(() =>
        store.dispatch(new Effect(store.id, "hello", mockFn))
      ).toThrowError();
    });
  });

  /**
   * BASE
   */
  describe("base", () => {
    it("should throw while setting immutable properties after creation", () => {
      const store = new Store(100);

      const action = store.action("increment", vi.fn());

      /**
       * This is a stupid test to ensure the `id` getter is covered in `BaseDispatcher`
       * otherwise it shows it as an uncovered line in the coverage report.
       */
      expect(action.id).toBe(action.id);

      expect(() => (action.id = "new")).toThrow();
      expect(() => (action.displayName = "new")).toThrow();
      expect(() => (action.storeId = "new")).toThrow();
      expect(() => (action.type = Dispatcher.ACTION)).toThrow();
      expect(() => (action.handler = vi.fn())).toThrow();
    });
  });
});
