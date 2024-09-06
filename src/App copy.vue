<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $router = useRouter();
const $route = useRoute();

// const count = ref(0);

const handleSelect = (index) => {
  console.log("select index: ", index);
  $router.push('/' + index);
};

</script>

<template>
  <el-menu
    default-active="customers"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <!-- <el-menu-item index="dashboard">Dashboard</el-menu-item>   -->
    <el-menu-item index="customers">Customers</el-menu-item>
    <el-menu-item index="hope">Hope</el-menu-item>
  </el-menu>
  
  <router-view/>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

#app {
  width: 100%;
  height: 100%;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
