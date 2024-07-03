export const removeDuplicates = <T = unknown>(arr: T[], key: keyof T) => {
  const set = new Set();
  const newArr = [] as T[];

  for (const v of arr) {
    if (!set.has(v[key])) newArr.push(v);
    set.add(v[key]);
  }

  return newArr;
};
