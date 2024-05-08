import {
  ActionHandler,
  Dispatch,
  Dispatcher,
  EffectHandler,
} from "./Dispatchers";
import { HistoryManager } from "./HistoryManager";

export class DispatchManager<State> extends HistoryManager<State> {
  constructor(state: State) {
    super(state);
  }

  #dispatchInternal: Dispatch<State> = (...args) => {
    const dispatcher = args[0];
    const payload = args[1];
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    const handler = this.getHandler(type, name);

    if (!handler) {
      throw new Error(
        `No ${type} dispatcher registered for '${name}' with store.`
      );
    }

    switch (type) {
      case Dispatcher.ACTION: {
        const actionHandler = handler as ActionHandler<State, typeof payload>;

        this.setState(
          actionHandler({
            state: this.getState(),
            payload,
          })
        );
      }

      case Dispatcher.EFFECT: {
        const effectHandler = handler as EffectHandler<State, typeof payload>;

        effectHandler({
          state: this.state,
          payload,
          dispatch: (...argv) => {
            const d = argv[0];
            const p = argv[1];
            const t = d.type;
            const n = d.displayName;

            this.#dispatchInternal(...argv);

            this.record({
              name: n,
              type: t,
              payload: p,
              global: false,
              source: {
                name,
                type,
              },
            });
          },
          getState: this.getState,
        });
      }
    }
  };

  public dispatch: Dispatch<State> = (...args) => {
    const dispatcher = args[0];
    const payload = args[1];
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    this.record({
      name,
      type,
      payload,
      global: true,
    });

    this.#dispatchInternal(...args);
  };
}
