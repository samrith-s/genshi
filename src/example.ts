import { Store } from "./Store";

/**
 * Example
 */
const store = new Store(0);

const increment = store.action<number>("increment", ({ state, payload }) => {
  return state + payload;
});

const plusMinus = store.action<boolean>("plus-minus", ({ state, payload }) => {
  return state + (!!payload ? 1 : -1);
});

const get = store.effect("data", ({ dispatch }) => {
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
  dispatch(increment, 10);
});

store.dispatch(get);

store.dispatch(increment, 10);
store.dispatch(plusMinus, Math.random() > 0.5);

store.printHistory();
