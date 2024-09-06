<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

// const count = ref(0)
</script>

<template>
  <h3>Dashboard</h3>
  <router-link
    :to="{
      name: 'Customer',
      params: {
        id: 8
      }
    }">cust 8</router-link>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
