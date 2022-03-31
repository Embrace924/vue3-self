
import { reactive } from "./reactive";
import { isObject, hasOwn } from "./share";
import { track, trigger } from "./effect";
const get = createGetter();
const set = createSetter();

function createGetter () {
  return function get (target, key, receiver) {// proxy+reflect
    const res = Reflect.get(target, key, receiver);// == target[key];
    track(target, 'get', key);
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  };
}

function createSetter () {
  return function set (target, key, value, receiver) {
    const hasKey = hasOwn(target, key);
    const oldValue = target[key]; // Reflect.set 操作前还是历史数据
    const res = Reflect.set(target, key, value, receiver); // 返回结果为true / false;
    if (!hasKey) {
      // 新增属性
      trigger(target, 'add', key, value);
    } else if (value !== oldValue) {
      //修改操作
      console.log('用户修改值', target, key);
      trigger(target, 'set', key, value);
    }
    return res;
  };
}
export const mutableHandler = {
  get,
  set
};
