export function DecorateAll(decorator: MethodDecorator) {
  return (target: Function) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod = descriptor.value instanceof Function;
      if (!isMethod) continue;
      decorator(target, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}

export function MethodDecorator(cb: Function) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      await cb(...args);
      await original.call(this, ...args);
    };
  };
}
