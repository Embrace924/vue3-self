export const isObject = (obj) => { return typeof obj == 'object' && obj != null; };
export const hasOwn = (target, key) => { return Object.prototype.hasOwnProperty.call(target, key); };
