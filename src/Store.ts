import {
  Action,
  ActionHandler,
  Dispatch,
  Effect,
  EffectHandler,
} from "./Dispatchers";

export class Store<State> {
  #state: State;

  constructor(state: State) {
    this.#state = state;
  }

  #actions: Map<string, Action<State, any>> = new Map();
  #effect: Map<string, Effect<State, any>> = new Map();

  public effect<Payload = never>(
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    return new Effect<State, Payload>(name, handler);
  }

  public action<Payload = never>(
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    return new Action<State, Payload>(name, handler);
  }

  public dispatch: Dispatch<State> = (...args) => {
    const dispatcher = args[0];
    const payload = args[1];
  };
}
