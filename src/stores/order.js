import { defineStore } from 'pinia'
import { useCustomerStore } from './customer'

export const useOrderStore = defineStore({
  id: 'orderStore',
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    error: null
  }),
  getters: {
    getCustomerOrders: (state) => {
      const customerStore = useCustomerStore()
      return state.orders.filter((customer) => customer.custId === customerStore.customer.id)
    }
  },
  actions: {
    async fetchComments() {
      this.comments = await fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
    }
  }
})