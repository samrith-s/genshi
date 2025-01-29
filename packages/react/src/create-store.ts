import * as Genshi from "@genshi/core";

import { useSyncExternalStore } from "react";

type Store<State> = Genshi.Store<State>;
type Accessor<State, Value> = (state: State) => Value;

/**
 * Creates a subscriber for `useSyncExternalStore` when `createStore`
 * is called, so that we do not create new function references on each
 * change event.
 */
function createSubscriber<S>(store: Store<S>) {
  return function subscription(callback: () => void) {
    /**
     * The `callback` is apparently called whenever the state changes.
     * Without this, the `useSyncExternalStore` hook did not exactly sync.
     */
    const listener = store.subscribe(callback);
    return listener.remove;
  };
}

/**
 * A convenience for creating a snapshot function that can be used
 * for both server and client rendering.
 */
function createSnapshot<S>(store: Store<S>) {
  /**
   * Creates a snapshot function that can be used to wrap
   * the callback with the current store instance.
   */
  return function getSnapshot<AS>(accessor: (state: S) => AS) {
    /**
     * Get a snapshot of the current state as per the accessor defined by consumer.
     */
    return function snapshot() {
      return accessor(store.getState());
    };
  };
}

/**
 * Create a store with an initial state value and an optional name.
 * This provides a `useStore` hook for consumers to use in their components.
 *
 * It also returns the store instance for consumers to use, to create actions and effects.
 *
 * ```tsx
 * const [useStore, store] = createStore<{
 *  count: number;
 * });
 *
 * const increment = store.action("increment", ({ state }) => ({
 *  ...state,
 *  count: state.count + 1,
 * }));
 *
 * ```
 */
export function createStore<State = unknown>(
  initialState: State,
  config?: Genshi.StoreConfig
) {
  const store = new Genshi.Store<State>(initialState, config);

  const subscriber = createSubscriber<State>(store);
  const getSnapshot = createSnapshot<State>(store);

  /**
   * A hook for consumers to use in their components to access the entire or a subset of
   * store state. It returns the state value and the dispatch function.
   *
   * ```ts
   * // Use the hook to access the count and dispatcher
   * const [count, dispatch] = useStore((state) => state.count);
   *
   * // Dispatch an action
   * dispatch(increment);
   * ```
   */
  function useStore<Value>(accessor: Accessor<State, Value>) {
    /**
     * Just directly typing it as `ReturnType<typeof accessor>` made
     * the value itself super ugly when the accessed value was large.
     * This is a simple type to brand it to something better looking.
     */
    type AccessedValue = ReturnType<typeof accessor>;

    const snapshot = getSnapshot(accessor);
    const internalState = useSyncExternalStore(subscriber, snapshot, snapshot);

    return [internalState, store.dispatch] as [
      AccessedValue,
      typeof store.dispatch,
    ];
  }

  /**
   * If the return is not specified explicitly, TypeScript assumed this
   * to be a tuple of (typeof useStore, Store<State>)[] which is incorrect.
   * This would mean that the tuple could have more than two values and
   * any of the values in the tuple could be either of them.
   *
   * In reality, the tuple will have exactly two values and the first value
   * will always be the `useStore` hook and the second value will always be
   * the Store<State>.
   */
  return [useStore, store] as [typeof useStore, Store<State>];
}
