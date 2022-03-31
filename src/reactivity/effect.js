export function effect (fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();

  }
  return effect;
}
let uid = 0;
let activeEffect;
const effectStack = []; //栈结构 ，当我目前effect正在执行的时候 不要再执行导致死循环

function createReactiveEffect (fn, options) {
   const effect = function reactiveEffect (params) {
    if (!effectStack.includes(effect)) { //防止死循环
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally {
        effectStack.pop();
        activeEffect = undefined;
      }
    }
  };
  effect.options = options;
  effect.id = uid++;
  effect.deps = [];
  return effect;
}
// weakmap结构
// {a:1,b:2}:{
//   a:[effect],
//   b:[effect1,effect2]
//}
const targetMap = new WeakMap(); // 用法与map一致，弱引用 不会内存泄漏
export function track (target, type, key) { // a=[effect] b=[effect1,effect2]
  console.log(1234,activeEffect,effectStack);
  if (activeEffect === undefined) {
    return; // 说明取值的时候没有effect正在执行 不依赖于effect
  }
  // console.log('target track', type, key, target);
  let depsMap = targetMap.get(target);// 根据key取值
  if (!depsMap) {
    depsMap = new Map();//{}:{}
    targetMap.set(target, depsMap);// 没有找到对应的依赖key 就新建 {a:1,b:2}:{}
  }
  let depsSet = depsMap.get(key); // depsMap里面再找key的依赖数组
  if (!depsSet) {
    depsSet = new Set();//Set{}
    depsMap.set(key, depsSet);// {a:1,b:2}: {key:Set[]}
  }
  if (!depsSet.has(activeEffect)) {
    // 记录，这个属性改变会触发哪些effect
    depsSet.add(activeEffect); // {a:1,b:2}:{key:Set[...oldEffect,effect]}
    // 双向记录， effect记录哪些effect需要触发它
    activeEffect.deps.push(depsSet); //effect.deps=[Set[...oldEffect,effect]]
  }
  console.log(targetMap);
}

export function trigger (target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  // console.log('target trigger', type, key, target);
  if (!depsMap) {
    return;
  }
  // computed计算属性优先级高于effect, 先执行computed计算值，再effect取值
  const effects = new Set();
  const computedRunners = new Set();
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect.options.computed) {
          computedRunners.add(effect);
        } else {
          effects.add(effect);
        }
      });
    }
  };
  if (key !== null) {
    const depsSet = depsMap.get(key);
    if (depsSet) {
      add(depsSet);
    }
  }
  if (type === 'add') {
    const isArr = Array.isArray(target);
    const depsSet = depsMap.get(isArr ? 'length' : "");
    if (depsSet) {
      add(depsSet);
    }
  }
  computedRunners.forEach(run);
  effects.forEach(run);
}

const run = (effect) => {
  if (effect.options.scheduler) {
    effect.options.scheduler();
  } else {
    effect();
  }
};


