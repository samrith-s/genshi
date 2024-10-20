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

  public dispatch: Dispatch<State> = (...args) => {
    const dispatcher = args[0];
    const payload = args[1];
    const type = dispatcher.type;
    const name = dispatcher.displayName;

    const handler = this.getHandler(dispatcher);

    const isGlobal = !dispatcher.parent;

    const trace = this.trace({
      global: isGlobal,
      name,
      type,
      payload,
      ...(!isGlobal
        ? {
            source: {
              name: dispatcher.parent?.displayName,
              type: dispatcher.parent?.type,
            },
          }
        : {}),
    });

    switch (type) {
      case Dispatcher.ACTION: {
        const actionHandler = handler as ActionHandler<State, typeof payload>;

        this.setState(
          actionHandler({
            state: this.getState(),
            payload,
          })
        );

        this.traceEnd(trace);

        break;
      }

      case Dispatcher.EFFECT: {
        const effectHandler = handler as EffectHandler<State, typeof payload>;

        this.traceEnd(trace);

        effectHandler({
          state: this.state,
          payload,
          dispatch: (...argv) => {
            const d = argv[0];
            d.parent = dispatcher;

            this.dispatch(...argv);
          },
          getState: this.getState,
        });

        break;
      }
    }
  };
}
