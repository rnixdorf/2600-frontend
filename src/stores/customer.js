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
    sub_types: [],
    sub_type: null,
    schema: null,
    current_issue: null,
    on_sale_date: null,
    current_batch: null,
    daily_sheets: [],
    daily_sheet_items: [],
    daily_sheet_item: null,
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
    getNewExpiration: (exp, years, issues) => {
      console.log("exp: ", exp, " years: ", years, " issues: ", issues);
      if(!exp) return "";
      let addIssues = issues + (years * 4);
      const [quarter, year] = exp.split('Q').map(Number);
      let newQuarter = quarter + addIssues;
      let newYear = year;
      while (newQuarter > 4) {
        newQuarter -= 4;
        newYear++;
      }
      while (newQuarter < 1) {
        newQuarter += 4;
        newYear--;
      }
      return `${newQuarter}Q${newYear}`;
    }
  }, 
  setter: {
    setLastName: (val) => {last_name = val}
  },
  actions: {
    createTempSubscription(data) {
      console.log("in createTempSubscription: ", data);
      let sub = {
        id: 0,
        subtype: data.type,
        expiration: data.expiration,
        active: true,
      }
      this.subscriptions = [];
      this.subscriptions.push(sub);
      console.log("temp sub: ", sub);
      console.log("subs: ", this.subscriptions);
      return sub;
    },
    async getBatch() {
      this.current_batch = null;
      this.error = null;
      try {
        this.current_batch = await API.getCurrentBatch()
        .then((response) => {
          return response.data
        })
        .catch((error) => {this.error = error; return null});
      } catch (error) {
        this.error = error
        return false;
      } finally {
        return true;
      }
    },
    async getDailySheets() {
      this.daily_sheets = null;
      this.error = null;
      try {
        this.daily_sheets = await API.getDailySheets()
        .then((response) => {
          return response.data
        })
        .catch((error) => {this.error = error; return null});
      } catch (error) {
        this.error = error
        return false;
      } finally {
        return true;
      }
    },
    async getDailySheetItems(id) {
      this.daily_sheet_items = null;
      this.error = null;
      try {
        this.daily_sheet_items = await API.getDailySheetItems(id)
        .then((response) => {
          console.log("getDailySheetItems: ", response.data);
          return response.data
        })
        .catch((error) => {this.error = error; return null});
      } catch (error) {
        this.error = error
        return false;
      } finally {
        return true;
      }
    },
    async getSettings() {
      this.current_issue = null;
      this.on_sale_date = null;
      this.error = null;
      try {
        await API.getSettings()
        .then((response) => {
          // console.log("settings: ", response.data[0]);
          this.current_issue = response.data[0].current_issue;
          this.on_sale_date = response.data[0].onsale.substring(0,10);
          console.log(this.current_issue, this.on_sale_date);
          return response.data
        })
        .catch((error) => {this.error = error; return null});
        
      } catch (error) {
        this.error = error
        return null;
      } finally {
        return true;
      }
    },
    async updateSettings(data) {
      try {
        const response = await API.updateSettings(data);
        return response.data;
      } catch (error) {
        this.error = error;
        return null;
      }
    },
    async fetchSubTypes() {
      this.sub_types = [];
      this.loading = true;
      this.error = null;
      try {
        this.sub_types = await API.getSubscriptionTypes()
        .then((response) => {
          return response.data
        })
        .catch((error) => {this.error = error; return null});
      } catch (error) {
        this.error = error
        return false;
      } finally {
        return true;
      }
    },
    async fetchCustomers(params) {
      this.customers = [];
      this.loading = true;
      this.error = null;
      this.schema = null;
      // console.log("in fetchCustomers params:", params)
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
    async updateCustomer(id, updatedFields) {
      try {
        const response = await API.updateCustomer(id, updatedFields);
        const updatedCustomer = response.data;

        // Update the customer in the local state
        const index = this.customers.findIndex(customer => customer.id === id);
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...updatedFields };
        }

        return updatedCustomer;
      } catch (error) {
        console.error('Failed to update customer:', error);
        throw error;
      }
    },
    async fetchCustomer(id) {
      this.customer = null
      // this.loading = true
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
      // console.log("in filterCustomer")
      this.filtered_customers = this.customers.filter((customer) => customer.Last.toUpperCase().includes(this.last_name.toUpperCase()) )
      // {this.customers.find((customer) => customer.Last.includes(last_name))}
    },
    async getCustomerOrdersById(customerId) {
      this.orders = []
      // this.loading = true
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
      // console.log("in getCustomerSubscriptionsById: ", customerId);
      if(customerId === undefined) return false;
      this.subscriptions = []
      // this.loading = true
      try {
        this.subscriptions = await API.getCustomerSubscriptionsById(customerId)
        .then((response) => {
          return response.data
        })
      } catch (error) {
        this.error = error;
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
      // this.loading = true
      let response = null;
      try {
        let addrChange = {
          first: data.first,
          last: data.last,
          company: data.company,
          phone: data.phone,
          email: data.email,
          address1: data.address1,
          address2: data.address2,
          address3: data.address3,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
        }
        if( data.hasOwnProperty('address_change') )
          addrChange.address_change = data.address_change;

        response = await API.updateCustomerAddress(customerId, addrChange)
        return response.data;
      } catch (error) {
        this.error = error;
        return error;
      } finally {
        this.loading = false;
      }
    },
    getSubTypeName(id) {
      const selectedSubType = this.sub_types.find(subType => subType.id === id);
      return selectedSubType ? selectedSubType.name : '';
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