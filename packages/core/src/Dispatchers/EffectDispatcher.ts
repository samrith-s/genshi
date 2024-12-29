import { BaseDispatcher, Dispatch, Dispatcher } from "./@BaseDispatcher";

export type EffectHandler<State, Payload> = ({
  dispatch,
  state,
}: {
  /**
   * The `dispatch` function is used to dispatch
   * other actions or effects.
   */
  dispatch: Dispatch;
  /**
   * The current state of the store.
   */
  state: State;
  /**
   * The payload that was dispatched with the effect.
   */
  payload: Payload;
}) => void;

/**
 * The `Effect` dispatcher is creates an effect that can be dispatched to the store.
 */
export class Effect<State, Payload> extends BaseDispatcher<
  Dispatcher.EFFECT,
  EffectHandler<State, Payload>,
  Payload
> {
  constructor(
    storeId: string,
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    super({
      storeId,
      displayName: name,
      type: Dispatcher.EFFECT,
      handler,
    });
  }
}
