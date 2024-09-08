import { defineStore } from 'pinia'
import API from "../services/data-service.js";
// import { AxiosError } from "axios";

export const useCustomerStore = defineStore({
  id: 'customerStore',
  state: () => ({
    customers: [],
    customer: null,
    loading: false,
    error: null,
    last_name: "",
    filtered_customers: [],
    orders: [],
    order: null,
    incoming_orders: [],
    incoming_order: null,
    subscriptions: [],
    subscription: null,
  }),
  getters: {
    getCustomerById: (state) => {
      return (custId) => state.customers.find((customer) => customer.userId === custId)
    },
    getCustomerByLast: (state) => {
      return (customers) => {state.customers.find((customer) => {customer.Last.includes(last_name) || customer.First.includes(last_name)})}
    },
  }, 
  setter: {
    setLastName: (val) => {last_name = val}
  },
  actions: {
    async fetchCustomers(params) {
      this.customers = [];
      this.loading = true;
      this.error = null;
      console.log("in fetchCustomers params:", params)
      try {
        
        this.customers = await API.getAllCustomers(params)
        .then((response) => {
          return response.data
        })
        .catch((error) => {this.error = error; return null});
        // this.filtered_customers = this.customers;
      } catch (error) {
        console.log("catch error: ",error)
        this.error = error
        return false;
      } finally {
        this.loading = false
        return true;
      }
    },
    async fetchCustomer(id) {
      this.customer = null
      this.loading = true
      try {
        this.customer = await API.getCustomerById(id)
        .then((response) => {
          return response.data
        })
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    filterCustomer() {
      console.log("in filterCustomer")
      this.filtered_customers = this.customers.filter((customer) => customer.Last.toUpperCase().includes(this.last_name.toUpperCase()) )
      // {this.customers.find((customer) => customer.Last.includes(last_name))}
    },
    async getCustomerOrdersById(customerId) {
      this.orders = []
      this.loading = true
      try {
        this.orders = await API.getCustomerOrdersById(customerId)
        .then((response) => {
          return response.data
        })
      } catch (error) {
        this.error = error
        return false;
      } finally {
        this.loading = false
        return true;
      }
    },
    async getCustomerSubscriptionsById(customerId) {
      this.subscriptions = []
      this.loading = true
      try {
        this.subscriptions = await API.getCustomerSubscriptionsById(customerId)
        .then((response) => {
          return response.data
        })
      } catch (error) {
        this.error = error
        return false;
      } finally {
        this.loading = false
        return true;
      }
    },
    async fetchIncomingOrders(params) {
      return [];
    },
    async updateCustomerAddress(customerId, data) {
      console.log("in updateCustomerAddress ", data);
      this.loading = true
      let response = null;
      try {
        response = await API.updateCustomerAddress(customerId, data)
      } catch (error) {
        this.error = error
        return error;
      } finally {
        this.loading = false
        return response.data;
      }
    }
  }
})