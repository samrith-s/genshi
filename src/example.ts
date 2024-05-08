import { Store } from "./Store";

/**
 * Example
 */
const store = new Store({
  count: 0,
});

const increment = store.action<number>("increment", ({ state, payload }) => {
  // console.log("## incrementing");
  return {
    count: state.count + payload,
  };
});

const plusMinus = store.action<boolean>("plus-minus", ({ state, payload }) => {
  console.log("## state in +/-", state);
  return {
    count: state.count + (!!payload ? 1 : -1),
  };
});

console.log("### state before", store.getState());

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

console.log("#history:");
console.table(
  store.history().map((history) => ({
    type: history.type,
    action: history.name,
    payload: history.payload ?? NaN,
    previousState: history.previousState,
    currentState: history.currentState,
    ...(history.source
      ? { source: `${history.source.type} -> ${history.source.name}` }
      : {}),
  }))
);

console.log("### state after", store.getState());
