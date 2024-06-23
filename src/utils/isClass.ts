export const isClass = (cls: Function) => {
  return cls?.toString()?.includes("class");
};
