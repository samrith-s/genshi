// eslint-disable-next-line import-x/no-unresolved
import { immer } from "@genshi/middlewares/immer";

import { createStore } from "../../src/create-store";

type State = {
  count: number;
  timer?: NodeJS.Timeout;
};

export const [useStore, store] = createStore<State>(
  {
    count: 0,
    timer: undefined,
  },
  {
    middlewares: {
      action: [immer()],
    },
  }
);

export const timer = store.action<NodeJS.Timeout | undefined>(
  "timer",
  ({ state, payload }) => {
    state.timer = payload;
    return state;
  }
);

export const increment = store.action("increment", ({ state }) => {
  state.count++;
  return state;
});

export const decrement = store.action("decrement", ({ state }) => {
  state.count--;
  return state;
});

export const plus = store.action<number>("plus", ({ state, payload }) => {
  state.count += payload;
  return state;
});

export const minus = store.action<number>("minus", ({ state, payload }) => {
  state.count -= payload;
  return state;
});

export const tick = store.effect("tick", ({ dispatch }) => {
  const time = setInterval(() => {
    dispatch(increment);
  }, 1000);

  dispatch(timer, time);
});

export const clear = store.effect("clear", ({ state, dispatch }) => {
  clearInterval(state.timer);
  dispatch(timer, undefined);
  dispatch(minus, state.count);
});
