/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDispatcher } from "./BaseDispatcher";
import { Dispatcher } from "./Dispatchers.decl";

// ======================== DISPATCHER ========================

export type AnyDispatcher<State> =
  | Action<State, any>
  | Action<State, never>
  | Effect<State, any>
  | Effect<State, never>;

export type DispatcherArgs<
  State,
  A extends AnyDispatcher<State>,
> = A["payload"] extends never
  ? [action: A]
  : [action: A, payload: A["payload"]];

export type Dispatch<State> = <A extends AnyDispatcher<State>>(
  ...args: DispatcherArgs<State, A>
) => void;

// ======================== ACTION ========================
export type ActionHandler<State, Payload> = ({
  state,
  payload,
}: {
  state: State;
  payload: Payload;
}) => State;

export class Action<State, Payload> extends BaseDispatcher<
  Dispatcher.ACTION,
  Payload
> {
  public parent: BaseDispatcher<Dispatcher, any> | null = null;

  public readonly handler: ActionHandler<State, Payload>;

  constructor(
    storeId: string,
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    super({
      storeId,
      displayName: name,
      type: Dispatcher.ACTION,
    });

    this.handler = (...args) => {
      const data = handler(...args);
      this.parent = null;
      return data;
    };
  }
}

// ======================== EFFECT ========================

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
  public parent: BaseDispatcher<Dispatcher, any> | null = null;

  public readonly handler: EffectHandler<State, Payload>;

  constructor(
    storeId: string,
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    super({
      storeId,
      displayName: name,
      type: Dispatcher.EFFECT,
    });

    this.handler = (...args) => {
      handler(...args);
      this.parent = null;
    };
  }
}
