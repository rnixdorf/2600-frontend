<!-- CompareDialog.vue -->
<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Compare Customer and Incoming Order</span>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <button color="blue darken-1" text @click="closeDialog">Close</button>
            </v-card-actions>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <h3>Customer</h3>
                            <p v-for="(value, key) in selectedCustomer" :key="key">
                                {{ key }}: {{ value }}
                            </p>
                        </v-col>
                        <v-col cols="6">
                            <h3>Incoming Order</h3>
                            <p v-for="(value, key) in selectedIncomingOrder" :key="key">
                                {{ key }}: {{ value }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <h3>Comparison</h3>
                            <p v-for="(comparison, key) in comparisons" :key="key">
                                {{ key }}: {{ comparison }}
                            </p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            
        </v-card>
    </v-dialog>
</template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    selectedCustomer: {
      type: Object,
      required: true
    },
    selectedIncomingOrder: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  const emit = defineEmits(['update:modelValue', 'close']);

  
  const dialog = ref(props.modelValue);
  
  watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
  });
  
  const comparisons = computed(() => {
    const result = {};
    for (const key in props.selectedCustomer) {
      if (props.selectedCustomer[key] === props.selectedIncomingOrder[key]) {
        result[key] = 'Match';
      } else {
        result[key] = 'Mismatch';
      }
    }
    return result;
  });
  
  const closeDialog = () => {
    dialog.value = false;
    emit('close');
  };
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>