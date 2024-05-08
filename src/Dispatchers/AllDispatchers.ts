import { BaseDispatcher } from "./BaseDispatcher";
import { Dispatcher } from "./Dispatchers.decl";

export type AnyDispatcher<State> =
  | Action<State, any>
  | Action<State, never>
  | Effect<State, any>
  | Effect<State, never>;

// ======================== ACTION ========================
export type ActionHandler<State, Payload> = ({
  state,
  payload,
}: {
  state: State;
  payload: Payload;
}) => Partial<State>;

export class Action<State, Payload> extends BaseDispatcher<
  Dispatcher.ACTION,
  Payload
> {
  public readonly handler: ActionHandler<State, Payload>;

  constructor(name: string, handler: ActionHandler<State, Payload>) {
    super({
      displayName: name,
      type: Dispatcher.ACTION,
    });

    this.handler = handler;
  }
}

// ======================== EFFECT ========================
export type Dispatch<State> = <A extends AnyDispatcher<State>>(
  ...args: A["payload"] extends never
    ? [action: A]
    : [action: A, payload: A["payload"]]
) => void;

export type EffectHandler<State, Payload> = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<State>;
  state: State;
  payload: Payload;
  getState(): State;
}) => void;

export class Effect<State, Payload> extends BaseDispatcher<
  Dispatcher.EFFECT,
  Payload
> {
  public readonly handler: EffectHandler<State, Payload>;

  constructor(name: string, handler: EffectHandler<State, Payload>) {
    super({
      displayName: name,
      type: Dispatcher.EFFECT,
    });

    this.handler = handler;
  }
}
