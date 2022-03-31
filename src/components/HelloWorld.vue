<script setup>
import { ref } from 'vue';

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"
      >Vite Documentation</a
    >
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <div class="father">
    <div class="son">son</div>
    <div class="son-small">son</div>
  </div>
  1111
  <div class="father1">
    <div class="son1">son</div>
  </div>
  <div class="father2">
    <div class="son2">son</div>
  </div>
</template>

<style lang="scss" scoped>
.father {
  width:200px;
  height:200px;
  display: flex;
  border: 1px solid #dddddd;
  // justify-content: center;
  // align-items: center;
  padding:10px;
  box-sizing:content-box;
}
.son {
  flex:1 1 auto;
  border: 1px solid #eeeeee;
}
.son-small{
  border: 1px solid #eeeeee;
}
.father1 {
  position: relative;
  border: 1px solid #dddddd;
  width: 200px;
  height: 200px;

}
.son1 {
  width: 50px;
  height: 50px;
  position: absolute;
  text-align: center;
  line-height: 50px;
  top: 50%;
  left: 50%;
  border: 1px solid #eeeeee;
  transform: translate(-50%, -50%);
}
.father2 {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  background: #92b922;

  .son2 {
    background: #de3168;
    display: inline-block;
    color: #fff;
    padding: 20px;
  }

  &:after {
    // display: inline-block;
    // content: '';
    // width: 0px;
    // height: 100%;
    // vertical-align: middle;
  }
}

a {
  color: #42b983;
}
</style>
