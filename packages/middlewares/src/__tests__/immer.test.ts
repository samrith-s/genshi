import { Store } from "@genshi/core";
import { describe, expect, it } from "vitest";

import { immer } from "../immer";

describe("immer middleware", () => {
  it("should apply middleware correctly", () => {
    const store = new Store(
      {
        count: 0,
      },
      {
        middlewares: {
          action: [immer()],
        },
      }
    );

    const action = store.action("increment", ({ state }) => {
      state.count++;
      return state;
    });

    expect(store.getState().count).toBe(0);

    store.dispatch(action);

    expect(store.getState().count).toBe(1);
  });
});
