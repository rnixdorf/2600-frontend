<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCustomerStore } from './stores/customer';
import { useHopeStore } from './stores/hope';

const $router = useRouter();
const $route = useRoute();

const selectedIndex = ref('');
const customerStore = useCustomerStore();
const { current_batch, current_issue } = storeToRefs(customerStore);

const hopeStore = useHopeStore();

const handleSelect = (index) => {
  // console.log("select index: ", index);
  selectedIndex.value = index;
  $router.push('/' + index);
};

const formattedCreateDate = computed(() => {
  // console.log('current_batch: ', current_batch.value);
  if (current_batch.value && current_batch.value.create_date) {
    return new Date(current_batch.value.create_date).toLocaleString();
  }
  return 'blah';
});

onBeforeMount(async () => {
  // console.log('beforeMount');
  await customerStore.getBatch();
  await customerStore.getSettings();
  await hopeStore.getSettings();
});

onMounted(async () => {
  
});

</script>

<template>
  <div>
    <div>
      <h1>2600 Magazine</h1>
      <div class="batch">
        <span v-if="current_batch != null" >Current Batch: {{ current_batch.id }}</span>
        <br>
        <span>{{ formattedCreateDate }}</span>
        <br>
        <span>Current Issue: {{ current_issue }}</span>
      </div>
      <ul class="menubar">
        <li @click="handleSelect('customers')" :class="{ selected: selectedIndex === 'customers' }">Customers</li>
        <li @click="handleSelect('orders')" :class="{ selected: selectedIndex === 'orders' }">Orders</li>
        <li @click="handleSelect('dailySheets')" :class="{ selected: selectedIndex === 'dailySheets' }">Daily Sheets</li>
        <li @click="handleSelect('agencies')" :class="{ selected: selectedIndex === 'agencies' }">Agencies</li>
        <li @click="handleSelect('hope')" :class="{ selected: selectedIndex === 'hope' }">Hope</li>
        <li @click="handleSelect('settings')" :class="{ selected: selectedIndex === 'settings' }">
          <i class="fas fa-cog"></i>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
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

.batch {
	float: left;
	/* width: 1em; */
	margin-left: 1em;
  text-align: left;
}

</style>
