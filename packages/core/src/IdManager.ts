import { generateUUID } from "./helpers/generate-uuid";

export abstract class IdManager {
  #id: string;

  constructor() {
    this.#id = generateUUID();
  }

  public get id() {
    return this.#id;
  }
}
