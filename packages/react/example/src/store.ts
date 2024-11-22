import { createStore } from "../../src/create-store";

export const [useStore, store] = createStore<{
  count: number;
  timer?: NodeJS.Timeout;
}>({
  count: 0,
  timer: undefined,
});

export const timer = store.action<NodeJS.Timeout | undefined>(
  "timer",
  ({ state, payload }) => ({
    ...state,
    timer: payload,
  })
);

export const increment = store.action("increment", ({ state }) => ({
  ...state,
  count: state.count + 1,
}));

export const decrement = store.action("decrement", ({ state }) => ({
  ...state,
  count: state.count - 1,
}));

export const plus = store.action<number>("plus", ({ state, payload }) => ({
  ...state,
  count: state.count + payload,
}));

export const minus = store.action<number>("minus", ({ state, payload }) => ({
  ...state,
  count: state.count - payload,
}));

export const tick = store.effect("tick", ({ dispatch }) => {
  console.log("running incremental effect");
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
