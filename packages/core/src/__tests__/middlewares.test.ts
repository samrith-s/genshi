import { describe, expect, it, vi } from "vitest";

import { ActionMiddleware, EffectMiddleware } from "../config";
import { ActionHandler } from "../dispatchers/action-dispatcher";
import { EffectHandler } from "../dispatchers/effect-dispatcher";
import { Store } from "../store";

describe("middlewares", () => {
  it("should support action middlewares", () => {
    const handlers: ActionHandler<number, undefined>[] = [];

    const actionMiddlewares = Array.from({ length: 10 }).map(() =>
      vi.fn().mockImplementation(({ state, handler }) => {
        handlers.push(handler);
        return state + 1;
      })
    ) as ActionMiddleware[];

    const lastMiddleware: ActionMiddleware = ({ state, handler, payload }) =>
      handler({ state, payload });

    const store = new Store(0, {
      middlewares: {
        action: [...actionMiddlewares, lastMiddleware],
      },
    });

    const action = store.action("increment", ({ state }) => state + 100);

    expect(store.getState()).toBe(0);

    store.dispatch(action);

    expect(store.getState()).toBe(110);

    actionMiddlewares.forEach((middleware, index) => {
      expect(middleware).toHaveBeenCalledOnce();
      expect(middleware).toHaveBeenCalledWith({
        state: index,
        handler: handlers[index],
      });
    });
  });

  it("should support effect middlewares", () => {
    const handlers: EffectHandler<number, undefined>[] = [];
    const argvs: Parameters<EffectHandler<number, undefined>>[] = [];

    const effectMiddlewares = Array.from({ length: 10 }).map(() =>
      vi.fn().mockImplementation((args) => {
        const { handler, dispatch } = args;

        argvs.push(args);
        handlers.push(handler);
        dispatch(action);
      })
    ) as EffectMiddleware[];

    const store = new Store(0, {
      middlewares: {
        effect: effectMiddlewares,
      },
    });

    const action = store.action("increment", ({ state }) => state + 1);

    const effect = store.effect("incremental-effect", ({ dispatch }) => {
      dispatch(action);
    });

    store.dispatch(effect);

    effectMiddlewares.forEach((middleware, index) => {
      expect(middleware).toHaveBeenCalledOnce();
      expect(middleware).toHaveBeenCalledWith(argvs[index]);
    });
  });
});
