import { effect,track, trigger } from "./effect";

export function computed (getterOrOptions) {
  let getter;
  let setter;

  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions;
    setter = () => { };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  let dirty = true; // 默认第一次取值 执行getter方法
  let computed;
  let runner = effect(getter, {
    lazy: true, // 懒加载
    computed: true, // 标识 是一个计算属性
    scheduler: () => { // 计算属性依赖发生变化时，执行 scheduler
      if (!dirty) {
        dirty = true;
        trigger(computed,'set','value')
      }
    }
  }); // effect最终 返回的getter函数
  console.log( dirty,  runner );
  let value;
  computed = {
    // .value取值
    get value () {
      if (dirty) {// 多次取值 不会重复执行runner
        track(computed,'get','value')
        value = runner(); // 执行getter函数 拿到执行后的值
        dirty = false;
       }
       console.log(value);
      return value; // 返回值
    },
    set value (newValue) {
      setter(newValue);
    }
  };
  return computed
}
