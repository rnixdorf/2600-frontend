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
    schema: null
  }),
  getters: {
    getCustomerById: (state) => {
      return (custId) => state.customers.find((customer) => customer.userId === custId)
    },
    getCustomerByLast: (state) => {
      return (customers) => {state.customers.find((customer) => {customer.Last.includes(last_name) || customer.First.includes(last_name)})}
    },
    getSchema: (state) => {
      return state.schema
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
      this.schema = null;
      console.log("in fetchCustomers params:", params)
      try {
        
        this.customers = await API.getAllCustomers(params)
        .then((response) => {
          
          return response.data
        })
        .catch((error) => {this.error = error; return null});
        // console.log("schema: ", this.customers[0].schema)
        if(this.customers.length > 0)
          this.schema = this.customers[0].schema;
        else
          this.schema = null;

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
          this.schema = response.data.schema;
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
    },
    getSubCode(type) {
      let dt = new Date();
      let year = dt.getFullYear();
      let month = dt.getMonth() + 1;
      let sub1 = '';
      switch(month) {
        case 1:
          sub1 = 'J';
          break;
        case 2:
          sub1 = 'F';
          break;
        case 3:
          sub1 = 'M';
          break;
        case 4:
          sub1 = 'A';
          break;
        case 5:
          sub1 = 'Y';
          break;
        case 6:
          sub1 = 'U';
          break;
        case 7:
          sub1 = 'L';
          break;
        case 8:
          sub1 = 'G';
          break;
        case 9:
          sub1 = 'S';
          break;
        case 10:
          sub1 = 'O';
          break;
        case 11:
          sub1 = 'N';
          break;
        case 12:
          sub1 = 'D';
          break;
        default:
          sub1 = 'X';
          break;
      }

      let yr = (year - 1995 + 2) % 36;
      let yrc = '';
      if( yr > 26 ) {
        yrc = (yr - 26).toString();
      }
      else
        yrc = (yr+9).toString(36).toUpperCase();
      let ret = sub1 + yrc + type;
      return ret;
    },
  }
})