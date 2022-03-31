import { mutableHandler } from "./baseHandler";
import { isObject } from "./share";

export function reactive (target) {
  // 创建一个响应式对象 对象 set map array object ...
  return createReactiveObject(target, mutableHandler);
}
function createReactiveObject (target, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  const observed = new Proxy(target, baseHandler);
  return observed;

}
