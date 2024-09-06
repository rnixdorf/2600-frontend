import { defineStore } from 'pinia'
import API from "../services/data-service.js";
// import { AxiosError } from "axios";

export const useHopeStore = defineStore({
  id: 'hopeStore',
  state: () => ({
    hopeTickets: [],
    ticket: null,
    hopetype: null,
    loading: false,
    error: null
  }),
  getters: {
    getHopeTicketById: (state) => {
      return (hopeId) => state.hopeTickets.filter((ticket) => ticket.id === hopeId)
    }
  },

  actions: {
    async fetchHopeTickets() {
      this.hopeTickets = []
      this.loading = true
      try {
        this.hopeTickets = await API.getAllHopeTickets(this.hopetype)
        .then((response) => {return response.data})
        .catch((error) => {this.error = error; return null})
      } catch (error) {
        console.log("catch error: ",error)
        this.error = error
        return false;
      } finally {
        this.loading = false
        return true;
      }
    },
    async fetchTicket(id) {
      console.log(`ticket id ${id}`)
      this.ticket = null
      this.loading = true
      try {
        this.ticket = await API.getHopeById(id)
        .then((response) => response.json())
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    setHopeType(type) {
      this.hopetype = type;
    },
  }
})