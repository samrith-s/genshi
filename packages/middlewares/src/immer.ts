import type { ActionMiddleware } from "@genshi/core";
import { produce } from "immer";

/**
 * The `immer` middleware allows you to use the {@link https://immerjs.github.io/immer/docs/introduction | Immer}
 * library to create immutable state updates.
 *
 * ```ts
 * import { Store } from "@genshi/core";
 * import { immer } from "@genshi/middlewares/immer";
 *
 * const store = new Store(
 *  { count: 0 },
 *  { middlewares: { action: [immer()] } }
 * );
 *
 * const action = store.action("increment", ({ state }) => {
 *  state.count++;
 *  return state;
 * });
 * ```
 */
export function immer() {
  const override: ActionMiddleware = ({ state, handler, payload }) => {
    return produce(state, (draft) => {
      handler({
        state: draft as typeof state,
        payload,
      });
    });
  };

  return override;
}
