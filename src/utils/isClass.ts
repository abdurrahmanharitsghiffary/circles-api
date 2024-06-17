export const isClass = (cls: Function) => {
  console.log(cls?.toString(), "cls");
  return cls?.toString()?.includes("class");
};
