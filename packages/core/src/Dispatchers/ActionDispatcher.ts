import { BaseDispatcher, Dispatcher } from "./@BaseDispatcher";

export type ActionHandler<State, Payload> = ({
  state,
  payload,
}: {
  state: State;
  payload: Payload;
}) => State;

/**
 * The `Action` dispatcher is creates an action that can be dispatched to the store.
 */
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
    super({
      storeId,
      displayName: name,
      type: Dispatcher.ACTION,
      handler,
    });
  }
}
