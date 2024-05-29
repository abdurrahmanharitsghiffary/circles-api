export const assignProps = <T>(obj: T, obj2: T): void => {
  for (const [key, value] of Object.entries(obj2)) {
    // @ts-ignore
    obj[key] = value;
  }
};
