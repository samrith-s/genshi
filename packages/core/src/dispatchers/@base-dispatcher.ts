export enum Dispatcher {
  ACTION = "action",
  EFFECT = "effect",
}

/**
 * The source of the dispatcher. This is used to track where the dispatcher was dispatched from.
 */
export type DispatcherSource = {
  /**
   * The name of the source of the effect that dispatched this dispatcher.
   */
  name: string;
  /**
   * The type of the source. This can be either an action or an effect.
   * Currently, this will always be an effect, since only effects can
   * dispatch other dispatchers.
   */
  type: Dispatcher;
};

/**
 * The configuration for a dispatcher.
 */
export type DispatcherConfig<Handler extends DispatchHandler> = {
  /**
   * The store ID that the dispatcher is associated with.
   */
  storeId: string;
  /**
   * The display name of the dispatcher. This is used in history and debugging.
   */
  displayName: string;
  /**
   * The type of dispatcher. This can be either an action or an effect.
   */
  type: Dispatcher;
  /**
   * The handler function that is called when the dispatcher is dispatched.
   */
  handler: Handler;
  /**
   * The source of the dispatcher. This is used to track where the dispatcher was dispatched from.
   */
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

/**
 * The base class that all dispatchers extend from.
 *
 * This class is abstract, and is expected to be extended by a concrete dispatcher class.
 * The base class provides the basic structure for a dispatcher, including the dispatcher's
 * type, store ID, display name, and handler function.
 *
 * This information is used across the library to provide a consistent interface for dispatchers.
 * It also helps in debugging, as the dispatcher's type, store ID, and display name are used in
 * history.
 */
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
    this.#id = `store-0001`;
    this.#displayName = displayName;
    this.#type = type as D;
    this.#storeId = storeId;
    this.#handler = this.finalizeHandler(handler);
  }

  /**
   * Simple wrapper for the handler function to remove the parent dispatcher reference.
   */
  private finalizeHandler(handler: DispatchHandler) {
    const finalHandler = (...args: Parameters<DispatchHandler>) => {
      this.parent = null;
      return handler(...args);
    };

    return finalHandler as Handler;
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
