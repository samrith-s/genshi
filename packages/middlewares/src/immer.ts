import type { ActionMiddleware } from "@genshi/core";
import { produce } from "immer";

export function immer<State>() {
  const override: ActionMiddleware = ({ state, handler, payload }) => {
    return produce(state, (draft) => {
      handler({
        state: draft as State,
        payload,
      });
    });
  };

  return override;
}
