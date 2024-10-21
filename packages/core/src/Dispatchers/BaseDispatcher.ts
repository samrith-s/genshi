import { generateUUID } from "../helpers/generate-uuid";

export enum Dispatcher {
  ACTION = "action",
  EFFECT = "effect",
}

export type DispatcherSource = {
  name: string;
  type: Dispatcher;
};

export type DispatcherConfig<Handler extends DispatchHandler> = {
  storeId: string;
  displayName: string;
  type: Dispatcher;
  handler: Handler;
  source?: DispatcherSource;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DispatchHandler = (...args: any[]) => any;

export type AnyDispatcher<Handler extends DispatchHandler> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | BaseDispatcher<Dispatcher, Handler, any>
  | BaseDispatcher<Dispatcher, DispatchHandler, never>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DispatcherArgs<A extends AnyDispatcher<any>> =
  A["payload"] extends never ? [action: A] : [action: A, payload: A["payload"]];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dispatch = <A extends AnyDispatcher<any>>(
  ...args: DispatcherArgs<A>
) => void;

export abstract class BaseDispatcher<
  D extends Dispatcher,
  Handler extends DispatchHandler,
  P = never,
> {
  #id: string;
  #displayName: string;
  #type: D;
  #storeId: string;
  #handler: Handler;
  #source?: DispatcherSource | null = null;

  public readonly payload: P = null as P;

  public parent: BaseDispatcher<Dispatcher, DispatchHandler, unknown> | null =
    null;

  constructor({
    storeId,
    displayName,
    type,
    handler,
  }: DispatcherConfig<Handler>) {
    this.#id = generateUUID();
    this.#displayName = displayName;
    this.#type = type as D;
    this.#storeId = storeId;
    this.#handler = handler;
  }

  public get id() {
    return this.#id;
  }

  public set id(_value: string) {
    throw new Error("Cannot set 'id' for dispatcher after creation");
  }

  public get displayName() {
    return this.#displayName;
  }

  public set displayName(_value: string) {
    throw new Error("Cannot set 'displayName' for dispatcher after creation");
  }

  public get type() {
    return this.#type;
  }

  public set type(_value: D) {
    throw new Error("Cannot set 'type' for dispatcher after creation");
  }

  public get storeId() {
    return this.#storeId;
  }

  public set storeId(_value: string) {
    throw new Error("Cannot set 'storeId' for dispatcher after creation");
  }

  public get handler() {
    return this.#handler;
  }

  public set handler(_value: Handler) {
    throw new Error("Cannot set 'handler' for dispatcher after creation");
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
