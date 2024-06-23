export function omitProperties<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = {} as Omit<T, K>;

  (Object.keys(obj) as (keyof T)[]).forEach((key) => {
    if (!keys.includes(key as K)) {
      // @ts-expect-error this is correct dont bother
      result[key] = obj[key];
    }
  });

  return result;
}
