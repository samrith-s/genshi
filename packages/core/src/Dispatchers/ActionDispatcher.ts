import { BaseDispatcher, Dispatcher } from "./BaseDispatcher";

export type ActionHandler<State, Payload> = ({
  state,
  payload,
}: {
  state: State;
  payload: Payload;
}) => State;

export class Action<State, Payload> extends BaseDispatcher<
  Dispatcher.ACTION,
  ActionHandler<State, Payload>,
  Payload
> {
  constructor(
    storeId: string,
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    const finalHandler: ActionHandler<State, Payload> = (...args) => {
      const data = handler(...args);
      this.parent = null;
      return data;
    };

    super({
      storeId,
      displayName: name,
      type: Dispatcher.ACTION,
      handler: finalHandler,
    });
  }
}
