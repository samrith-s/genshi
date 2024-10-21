import { BaseDispatcher, Dispatch, Dispatcher } from "./BaseDispatcher";

export type EffectHandler<State, Payload> = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch;
  state: State;
  payload: Payload;
  getState(): State;
}) => void;

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
    const finalHandler: EffectHandler<State, Payload> = (...args) => {
      handler(...args);
      this.parent = null;
    };

    super({
      storeId,
      displayName: name,
      type: Dispatcher.EFFECT,
      handler: finalHandler,
    });
  }
}
