<template>
    <div v-if="visible" class="dialog-overlay">
      <div class="dialog-content">
        <slot></slot>
        <button @click="close">Close</button>
        <button @click="submitData">Submit</button>
      </div>
    </div>
</template>
  
<script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    visible: Boolean,
  });
  
  const emit = defineEmits(['close-memo', 'submit-memo']);
  
  const close = () => {
    emit('close-memo');
  };

  const submitData = () => {
    const data = { message: 'Data from dialog' }; // Replace with actual data
    emit('submit-memo', data);
    close();
  };
</script>
  
<style scoped>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
  }
</style>