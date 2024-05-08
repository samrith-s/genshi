import { DispatchManager } from "./DispatchManager";
import {
  Action,
  ActionHandler,
  Dispatch,
  Dispatcher,
  Effect,
  EffectHandler,
} from "./Dispatchers";

export class Store<State> extends DispatchManager<State> {
  constructor(state: State) {
    super(state);
  }

  public effect<Payload = never>(
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    const dispatcher = new Effect<State, Payload>(name, handler);
    this.registerEffect(dispatcher);
    return dispatcher;
  }

  public action<Payload = never>(
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    const dispatcher = new Action<State, Payload>(name, handler);
    this.registerAction(dispatcher);
    return dispatcher;
  }
}
