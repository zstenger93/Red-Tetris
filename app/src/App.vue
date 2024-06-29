<template>
  <div id="app">
    <HomePage />
  </div>
</template>

<script>

import HomePage from './client/HomePage.vue';
export default {
  name: 'App',
  components: {
    HomePage
  }
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>