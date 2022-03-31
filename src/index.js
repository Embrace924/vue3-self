import { effect, reactive, computed } from './reactivity';

// const state = reactive({ name: 'cld', age: 26, like: 'paint' });
// state.age;
// state.age = 28;
// console.log('state.arr', state.arr);
// 调用push 方法时 会先像数组中插入之 然后更新length 会执行两次
// 但其实push后同时更新了length 所以后面触发的length更新无意义

const state = reactive({ name: 'cld', age: 26, arr: [1, 2, 3], obj: { attr1: 'attr1', attr2: 'attr2' } });
const myAge = computed(() => {
  console.log('computed',state.age + 1);
  return state.age + 1;
});

effect(() => {
  console.log('effect内执行:', myAge.value);
});
// state.age = 100
// state.obj.attr1 = 'cld2';
