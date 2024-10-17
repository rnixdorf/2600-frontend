<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $router = useRouter();
const $route = useRoute();

let selectedIndex = ref('');

const handleSelect = (index) => {
  console.log("select index: ", index);
  selectedIndex.value = index;
  $router.push('/' + index);
};

</script>

<template>
  <div>
    <h1>2600 Magazine</h1>
    <ul class="menubar">
      <li @click="handleSelect('customers')" :class="{ selected: selectedIndex === 'customers' }">Customers</li>
      <li @click="handleSelect('orders')" :class="{ selected: selectedIndex === 'orders' }">Orders</li>
      <li @click="handleSelect('agencies')" :class="{ selected: selectedIndex === 'agencies' }">Agencies</li>
      <li @click="handleSelect('hope')" :class="{ selected: selectedIndex === 'hope' }">Hope</li>
      <!-- <li @click="handleSelect(3)">Contact</li> -->
    </ul>
  </div>
  <RouterView />

</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 0em;
  margin-top: 10px;
  line-height: .5;
}

.menubar {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.menubar li {
  margin: 0 30px;
  cursor: pointer;
  font-size: 2em;
  font-style: italic;
}

.menubar li:hover {
  color: blue;
}

.selected {
  text-decoration: underline;
}

</style>
