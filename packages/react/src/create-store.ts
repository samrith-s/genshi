import * as Hali from "@hali/core";
import { useEffect, useState as useReactState } from "react";

type Dispatch<State> = Hali.Dispatch<State>;
type Store<State> = Hali.Store<State>;

type Accessor<State, Value> = (state: State) => Value;

export function createStore<State = unknown>(state: State) {
  const store = new Hali.Store<State>(state);

  function useStore<Value>(accessor: Accessor<State, Value>) {
    type AccessedValue = ReturnType<typeof accessor>;

    const [internalState, setInternalState] = useReactState<AccessedValue>(
      accessor(state)
    );

    useEffect(() => {
      const subscriber = store.subscribe((state) => {
        setInternalState(accessor(state));
      });

      return () => {
        subscriber.remove();
      };
    }, [accessor]);

    return [internalState, store.dispatch, store] as unknown as [
      AccessedValue,
      Dispatch<State>,
      Store<State>,
    ];
  }

  return [useStore, store] as [typeof useStore, Store<State>];
}
