/**
 * The `IdManager` class is used to manage the id and name of the store.
 * It is the root class for Genshi.
 *
 * The `IdManager` class also adds a `tag` property which is either the `name` or `id`.
 * The tag is used in error messages.
 *
 * This is the only class that doesn't allow setting any value (apart from `name`)
 * after creation.
 *
 * It is an abstract class as it has no merit on its own. It is meant to be
 * extended by intermediate classes.
 */
export abstract class IdManager {
  readonly #id: string;
  #name = "";

  static #counter = 0;

  constructor() {
    this.#id = `store-${(IdManager.#counter++).toString().padStart(4, "0")}`;
  }

  protected setName(name: string) {
    this.#name = name;
  }

  public get id() {
    return this.#id;
  }

  public set id(_value: string) {
    throw new Error("Cannot set 'id' for store after creation");
  }

  public get name() {
    return this.#name;
  }

  public set name(_value: string) {
    throw new Error("Cannot set 'name' for store after creation");
  }

  public get tag() {
    return this.#name || this.#id;
  }

  public set tag(_value: string) {
    throw new Error("Cannot set 'tag' for store after creation");
  }
}
