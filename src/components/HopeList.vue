<script setup>
  import { storeToRefs } from 'pinia'
  import { useHopeStore } from '../stores/hope'
  import { onMounted, ref, computed, onBeforeMount } from "vue";

  const { hopeTickets, loading, error, hopetype } = storeToRefs(useHopeStore());
  const hopeStore = useHopeStore();

  const params = ref({last_name: '', email: ''});

  const emit = defineEmits(['select-ticket']);

  const selectHope = (ticket) => {
    emit('select-ticket', ticket);
  };

  onMounted(async () => {
    await hopeStore.getSettings();
    hopeStore.setHopeType(hopetype)
    const success = await hopeStore.fetchHopeTickets(hopetype);
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    
    // else
    //   console.log("Customers fetched");
  });
  const lastHopeFilter = computed({
    get() {
      // console.log("in zip getter");
      return params.value.last_name;
    },
    async set(val) {
      // console.log("in zip setter ", val);
      params.value.last_name = val;
      await hopeStore.fetchHopeTickets(params.value);
    }
  });
  const emailHopeFilter = computed({
    get() {
      return params.value.email;
    },
    async set(val) {
      params.value.email = val;
      await hopeStore.fetchHopeTickets(params.value);
    }
  });
</script>

<template>
  <div class="hope-list">
    <h2>Hope List</h2>
      <br>
      <div class="searchInputs">
        <label class="searchLabel">Lastname</label>
        <input
              name="lastNameHopeSearch"
              class="search-field textfield-closed"
              type="search"
              placeholder="Search Last Name" 
              v-model="lastHopeFilter"
        />
        <br>
        <label class="searchLabel">Email</label>
        <input
              name="emailHopeSearch"
              class="search-field textfield-closed"
              type="search"
              placeholder="Search Email" 
              v-model="emailHopeFilter"
        />
      </div>
      <hr>
      <p v-if="loading">Loading hope tickets...</p>
      <p v-if="error">{{ error.message }}</p>
      <div v-if="hopeTickets">
        <p v-for="ticket in hopeTickets" :key="ticket.id" @click="selectHope(ticket)">
            Order num: {{ ticket.order_num }}&emsp;Qty: {{ ticket.quantity }}
            <br>
            {{ ticket.first_name }} {{ ticket.last_name }}
            <br>
            <div v-if="ticket.email != ''">{{ ticket.email }}</div>
          <hr>
        </p>
      </div>
    </div>


</template>

<style scoped>
.hope-list {
  width: 200px;
  background: #f5f5f5;
  padding: 10px;
  flex: 1;
}
.hope-list ul {
  list-style-type: none;
  padding: 0;
}
.hope-list li {
  cursor: pointer;
  padding: 5px;
}
.hope-list li:hover {
  background: #ddd;
}

.searchLabel {
  display: inline-block;
  /* font-size: 1.2em; */
  font-weight: bold;
  width: 5em;
}

.searchInputs {
  text-align: left;
}
.search-field {
  width: 12em;
}


</style>