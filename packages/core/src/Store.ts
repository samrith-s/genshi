import { DispatchManager } from "./DispatchManager";
import { Action, ActionHandler } from "./Dispatchers/ActionDispatcher";
import { Effect, EffectHandler } from "./Dispatchers/EffectDispatcher";

export class Store<State> extends DispatchManager<State> {
  constructor(state: State, name?: string) {
    super(state);
    if (name) {
      this.setName(name);
    }
  }

  public effect<Payload = never>(
    name: string,
    handler: EffectHandler<State, Payload>
  ) {
    const dispatcher = new Effect<State, Payload>(this.id, name, handler);
    this.registerDispatcher(dispatcher);
    return dispatcher;
  }

  public action<Payload = never>(
    name: string,
    handler: ActionHandler<State, Payload>
  ) {
    const dispatcher = new Action<State, Payload>(this.id, name, handler);
    this.registerDispatcher(dispatcher);
    return dispatcher;
  }
}
