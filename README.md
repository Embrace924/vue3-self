# Vue 3  
## vue3 简易实现proxy代理 
简易实现了一下vue3 的 proxy代理方式，很多边缘特殊情况暂没有考虑，只梳理了一下核心逻辑。
如果感兴趣可以继续看下一篇[vue3 简易实现 effect](https://blog.csdn.net/Embrace924/article/details/123766448?spm=1001.2014.3001.5502)
1.基础数据

```javascript
const state = reactive({ name: 'cld', age: 26, like: 'paint' });
console.log("获取更改age前的值", state.age);
state.age = 28;
console.log("获取更改age后的值", state.age);
```
核心逻辑 reactive
```javascript
export function reactive (target) {
  // 创建一个响应式对象 对象 set map array object ...
  return createReactiveObject(target, {
    // proxy + reflect
    get (target, key, receiver) {
      // 可能无法访问key target[key]是否成功不会报错 所以使用reflect
      const res = Reflect.get(target, key, receiver); // == target[key];
      console.log('用户取值', target, key);
      return res;
    },
    set (target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      console.log('用户设置值', target, key);// == target[key]=value;
      return res;
    }
  });
}
const isObject = (obj) => { return typeof obj == 'object' && obj != null; };
function createReactiveObject (target, baseHandler) {
// 如果不是对象 不需要代理
  if (!isObject(target)) {
    return target;
  }
  // target目标对象 baseHandler get/set 值处理方法，
  const observed = new Proxy(target, baseHandler);
  return observed;
}

```

```javascript
/** Reflect 作用
 * 可能无法访问key target[key]是否成功不会报错 
 * 所以使用reflect
 * Reflect.get 返回值   Reflect.set 返回值boolean
 **/
const res = Reflect.get(target, key, receiver);  
// Reflect.get(target, key, receiver);  等价于 target[key] 并返回值
const res = Reflect.set(target, key, value, receiver);  
// res  值为true/false 表示是否成功设置值
```

> get方法的参数一共有三个：target是实例化Proxy时使用的对象，在这个例子中是obj；而property是这次读取操作中想要获取的属性名，在这个例子中是key；最后一个参数receiver则是这个实例化的Proxy自身，即proxy。
![在这里插入图片描述](https://img-blog.csdnimg.cn/ed86054f81d34cf59d392847fae216e2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)

代理实现效果
![运行结果](https://img-blog.csdnimg.cn/3d2a43fadd8947779dd6d509aa97346f.png)

> vue3取值的时候才走代理操作，不取值的时候，不需要深度遍历代理， 
> vue2一开始就深度递归  

取值的时候当数据里为数组或对象的情况下，需要递归代理
```javascript
get (target, key, receiver) {// proxy+reflect
    const res = Reflect.get(target, key, receiver);// == target[key];
    if (isObject(res)) {
      console.log('get时: 如果是对象 继续代理',res)
      return reactive(res);
    }
    return res;
  };
```
**修改值**
```javascript
//只执行console.log(state.name) 的时候 只打印出cld
console.log(state.name)
// 如果执行这一句，也不会走递归代理
state.obj='attrTest';
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/79c059d77da5498ca90b89b2dcafa9eb.png)
**修改对象中的值**
```javascript
console.log(state.name)
// 执行下一句的时候 先去 get拦截中获取到obj还是对象，继续递归的拦截 然后取值
state.obj.attr1='attrTest';
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/3442bdabe613482480531f437c922c4a.png)


修改值的时候，具体是新增操作还是修改操作 可以定位
```javascript
set (target, key, value, receiver) {
    const hasKey = hasOwn(target, key);
    const oldValue = target[key]; // Reflect.set 操作前还是历史数据
    const res = Reflect.set(target, key, value, receiver); 
    if (!hasKey) {
      // 新增属性
      console.log('用户新增值', target, key);
    } else if (value !== oldValue) {
      //修改操作
      console.log('用户修改值', target, key);
    }
    return res;
  };
```
push数据的时候，会先取arr的push属性，然后取array的length属性
![在这里插入图片描述](https://img-blog.csdnimg.cn/d0527edb28dc417683c813e6bb09aa72.png)
设置值的时候 key是index索引，在该索引上增加值
![在这里插入图片描述](https://img-blog.csdnimg.cn/a458ebf62e4e498ea793677b5e6f0c67.png)
其实在该索引上增加值之后，还会再次触发set 应该数组的长度改变了
为了减少多余的无必要的操作，可以通过判断不执行任何操作
![w_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)](https://img-blog.csdnimg.cn/3e5495574a2a417da27cd70d74366754.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)

vue3 reactive代理源码[github](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts)

## vue3 effect 实现思路

首先了解这张图
![在这里插入图片描述](https://img-blog.csdnimg.cn/3d4f93dc49134755b5c3b7497debe687.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f56c26fc357a4b1eb219e3f445350279.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7595d5c90261478985b6ac7b2043b090.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/4e4fc47e2148465db5f0fce094e774ef.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)

```javascript
const state = reactive({ name: 'cld', age: 26, arr: [1, 2, 3], obj: { attr1: 'attr1', attr2: 'attr2' } });
effect(()=>{
  console.log('effect内执行:',state.obj.attr1)
})
state.obj.attr1='cld2'
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/0929200754cf4b4cb473b695a0233e31.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)
大概思路清楚了 开始分析代码
**创建effect函数**
传入一个函数与options对象
```javascript
export function effect (fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) { 
    effect();
  }
  return effect;// 非立即执行的情况
}
```
createReactiveEffect内部处理
```javascript
let uid = 0; // 给每个effect加唯一标识
let activeEffect // 当前正在执行的effect;
const effectStack = []; //判断当我目前effect正在执行的时候 不要继续添加 不要再执行导致死循环

function createReactiveEffect (fn, options) {
  const effect = function reactiveEffect (params) {
    if (!effectStack.includes(effect)) { // 防止死循环
      try { // fn可能会出错 要退出
        effectStack.push(effect);
        activeEffect = effect;
        fn(); // 执行传进来的函数
      } finally {
        effectStack.pop();
        activeEffect = undefined;
      }
    }
  };
  effect.options = options;
  effect.id = uid++; // 唯一标识
  effect.deps = []; // 存储会导致它执行的数据
  return effect;
}
```

 - 当我执行effect的时候 会执行上面的函数 
 - 在effect内部获取数据的时候 会执行new proxy 中的 get函数
 - 主要是 new proxy   里面的 get 函数的拦截处理**触发track函数** 
 - 去收集该属性相关的effect在数组中
```javascript
  function get (target, key, receiver) { // proxy+reflect
    const res = Reflect.get(target, key, receiver);// == target[key];
    // 主要是这里的触发函数 
    track(target, 'get', key);
    if (isObject(res)) { // 如果绑定的是对象 继续递归 知道是基本数据为止
      return reactive(res);
    }
    return res;
  };
```
**track函数**的目的是组成weakmap 对象，把依赖的effect都存起来
```javascript
// weakmap结构
// {a:1,b:2}:{
//   a:[effect],
//   b:[effect1,effect2]
//}
const targetMap = new WeakMap(); // 用法与map一致，弱引用 不会内存泄漏
export function track (target, type, key) { //假如 target={a:1,b:2} key=a
  if (activeEffect === undefined) {
    return; // 说明取值的时候没有effect正在执行 该次取值不在effect中，不依赖于effect
  }
  let depsMap = targetMap.get(target);// 根据target在WeakMap中取值 
  if (!depsMap) { // 没有相关依赖说明是第一次绑定 新建依赖map
    depsMap = new Map();//{}:{}
    targetMap.set(target, depsMap);// targetMap = { {a:1,b:2}:{} }
  }
  let depsSet = depsMap.get(key); //根据key在map中取值  depsMap里面找key(a)的依赖数组
  if (!depsSet) {
    depsSet = new Set(); //Set{}
    depsMap.set(key, depsSet);// {a:1,b:2}: {a:Set[]}
  }
  // 执行到某个effect里面获取值的时候，存入当前这个effect，
  // 当这个值在其他地方更新的时候 会重新执行这个effect
  if (!depsSet.has(activeEffect)) {
    // 记录，这个属性改变会触发哪些effect
    depsSet.add(activeEffect); // {a:1,b:2}:{key:Set[...oldEffect,effect]}
    // 双向记录， effect记录哪些effect需要触发它
    activeEffect.deps.push(depsSet); //effect.deps=[Set[...oldEffect,effect]]
  }
}
```
 - 当我在effect外部去更改值的时候 
 - 会触发new Proxy中的 set 拦截 从而触发**trigger函数**
 -  **trigger函数**去**查找**到改属性对应的weakMap上的 **effect 依赖数组**

```javascript
function set (target, key, value, receiver) {
    const hasKey = hasOwn(target, key);
    const oldValue = target[key]; // Reflect.set 操作前还是历史数据
    const res = Reflect.set(target, key, value, receiver); // 更改值并且 返回结果为true / false;
     // 新增属性
    if (!hasKey) {
	  console.log('用户修改值', target, key);
     // 触发trigger
      trigger(target, 'add', key, value);
    } else if (value !== oldValue) {
      //修改操作
      console.log('用户修改值', target, key);
      // 触发trigger
      trigger(target, 'set', key, value);
    }
    return res;
  };
```
**trigger函数**的目的是在weakmap 对象里面找到该属性的值，也就是依赖的effect数组

```javascript
export function trigger (target, type, key, value, oldValue) {
// {
//  {a:1,b:2}:{
//    a:[effect],
//    b:[effect1,effect2]
//   }
// {c:3,d:4}:{
//    c:[effect],
//    d:[effect1,effect2]
//   }
//}
  const depsMap = targetMap.get(target);  //假如 target={a:1,b:2} key=a
//  {a:1,b:2}:{
//    a:[effect],
//    b:[effect1,effect2]
//   }
  console.log('target trigger',type,key,target);
  if (!depsMap) {
    return;
  }
  if (key !== null) {
    const depsSet = depsMap.get(key);// 得到 a:[effect]
    if (depsSet) {// [effect]
      runEffect(depsSet); // 遍历执行
    }
  }


}
const runEffect = (effects) => {
  effects.forEach(effect => {
    effect();
  });
};
```
**trigger 要考虑特殊情况**
比如数组添加元素等 后续更新
```javascript
  if (type === 'add') {
    const isArr = Array.isArray(target);
    const depsSet = depsMap.get(isArr ? 'length' : "");
    if (depsSet) {
      runEffect(depsSet);
    }
  }
```

vue3 关于effect的源码部分[github](https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts)

![vue3 思路图](https://img-blog.csdnimg.cn/db820ee0e44e465089c3271e6eb79061.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARW1icmFjZTkyNA==,size_20,color_FFFFFF,t_70,g_se,x_16)

