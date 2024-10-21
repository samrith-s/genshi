import * as Hali from "@hali/core";
import { useEffect, useState as useReactState } from "react";

type Store<State> = Hali.Store<State>;

type Accessor<State, Value> = (state: State) => Value;

export function createStore<State = unknown>(state: State, name?: string) {
  const store = new Hali.Store<State>(state, name);

  function useStore<Value>(accessor: Accessor<State, Value>) {
    type AccessedValue = ReturnType<typeof accessor>;
    type History = ReturnType<typeof store.history>;
    type Dispatch = typeof store.dispatch;

    const [internalState, setInternalState] = useReactState<AccessedValue>(
      accessor(state)
    );

    const [internalHistory, setInternalHistory] = useReactState<
      ReturnType<typeof store.history>
    >(store.history());

    useEffect(() => {
      const subscriber = store.subscribe((state) => {
        setInternalState(accessor(state));
        setInternalHistory(store.history());
      });

      return () => {
        subscriber.remove();
      };
    }, [accessor]);

    return [internalState, store.dispatch, internalHistory] as unknown as [
      AccessedValue,
      Dispatch,
      History,
    ];
  }

  return [useStore, store] as [typeof useStore, Store<State>];
}
