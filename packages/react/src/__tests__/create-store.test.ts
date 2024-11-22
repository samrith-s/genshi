import { renderHook, act } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";

import { createStore } from "../create-store";

const INITIAL_STATE = {
  count: 0,
};

describe("createStore", () => {
  it("should create a store with the defined initial state", () => {
    const [_, store] = createStore(INITIAL_STATE);

    expect(store.getState()).toEqual(INITIAL_STATE);
  });

  it("should be able to use the hook with the store", () => {
    const [useStore] = createStore(INITIAL_STATE);

    const { result } = renderHook(() => useStore((state) => state.count));
    const [count] = result.current;

    expect(count).toBe(0);
  });

  it("should dispatch the action using the dispatcher provided by the hook", () => {
    const [useStore, store] = createStore(INITIAL_STATE);

    const increment = store.action("increment", ({ state }) => ({
      ...state,
      count: state.count + 1,
    }));

    const { result } = renderHook(() => useStore((state) => state.count));

    expect(result.current.at(0)).toBe(0);
    expect(store.getState().count).toBe(0);

    const dispatch = result.current[1];

    act(() => dispatch(increment));

    expect(result.current.at(0)).toBe(1);
    expect(store.getState().count).toBe(1);
  });
});
