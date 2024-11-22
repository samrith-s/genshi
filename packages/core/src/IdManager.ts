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
