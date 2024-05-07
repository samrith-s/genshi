import { Store } from "./Store";

/**
 * Example
 */
const store = new Store({
  count: 0,
});

const increment = store.action<number>("increment", ({ state, payload }) => ({
  count: state.count + payload,
}));

const plusMinus = store.action<boolean>("plus-minus", ({ state, payload }) => ({
  count: state.count + (payload ? 1 : -1),
}));

const get = store.effect("data", ({ dispatch }) => {
  dispatch(plusMinus, Math.random() > 0.5);
});

store.dispatch(get);

store.dispatch(increment, 10);
