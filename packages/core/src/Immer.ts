type Draft<T> = {
  -readonly [K in keyof T]: T[K] extends object ? Draft<T[K]> : T[K];
};

type Patch<T> = {
  [K in keyof T]?: T[K] extends object ? Patch<T[K]> : T[K];
};

function produce<T>(base: T, recipe: (draft: Draft<T>) => void): T {
  const draft = deepClone(base);
  recipe(draft);
  return draft;
}

function deepClone<T>(source: T): T {
  if (Array.isArray(source)) {
    return source.map((item) => deepClone(item)) as unknown as T;
  } else if (typeof source === "object" && source !== null) {
    const clonedObj = {} as T;
    for (const key in source) {
      clonedObj[key] = deepClone(source[key]);
    }
    return clonedObj;
  } else {
    return source;
  }
}

function set<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return produce(obj, (draft) => {
    draft[key] = value;
  });
}

function update<T, K extends keyof T>(
  obj: T,
  key: K,
  updater: (value: T[K]) => T[K]
): T {
  return produce(obj, (draft) => {
    draft[key] = updater(draft[key]);
  });
}
