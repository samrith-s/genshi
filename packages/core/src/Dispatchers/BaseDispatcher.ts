import {
  Dispatcher,
  DispatcherConfig,
  DispatcherSource,
} from "./Dispatchers.decl";

export abstract class BaseDispatcher<D extends Dispatcher, P = never> {
  public readonly displayName: string;
  public readonly type: D;
  public readonly payload: P = null as P;

  #source?: DispatcherSource | null = null;

  constructor({ displayName, type }: DispatcherConfig) {
    this.displayName = displayName;
    this.type = type as D;
  }

  public source(source?: DispatcherSource | null) {
    if (source || source === null) {
      this.#source = source;
    }

    return {
      ...this.#source,
    };
  }
}
