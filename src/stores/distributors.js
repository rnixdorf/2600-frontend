import { defineStore } from 'pinia'
import API from "../services/data-service.js";

export const useDistributorStore = defineStore({
	id: 'distributorStore',
	state: () => ({
		distributors: [],
		distributor: null,
		loading: false,
		error: null,
		company: "",
		filtered_distributors: [],
		orders: [],
		order: null,
	}),
	getters: {
		getDistributorById: (state) => {
			return (distId) => state.distributors.find((distributor) => distributor.id === distId)
		},
		getDistributorByCompany: (state) => {
			return (distributors) => { state.distributors.find((distributor) => { distributor.company.includes(company) }) }
		},
	},
	setter: {
		setCompanyName: (val) => { company = val }
	},
	actions: {
		async fetchDistributors(params) {
			this.distributors = [];
			this.loading = true;
			this.error = null;
			// console.log("in fetchDistributors params:", params)
			try {

				this.distributors = await API.getAllDistributors()
					.then((response) => {
						// console.log("response.data: ", response.data)
						return response.data
					})
					.catch((error) => { this.error = error; return null });
			} catch (error) {
				console.log("catch error: ", error)
				this.error = error
				return false;
			} finally {
				this.loading = false
				return true;
			}
		},
		async fetchDistributor(id) {
			this.distributor = null
			this.loading = true
			try {
				this.distributor = await API.getDistributorById(id)
					.then((response) => {
						return response.data
					})
			} catch (error) {
				this.error = error
			} finally {
				this.loading = false
			}
		},
		// filterCustomer() {
		// 	console.log("in filterCustomer")
		// 	this.filtered_customers = this.customers.filter((customer) => customer.Last.toUpperCase().includes(this.last_name.toUpperCase()))
		// },
		// async getCustomerOrdersById(customerId) {
		// 	this.orders = []
		// 	this.loading = true
		// 	try {
		// 		this.orders = await API.getCustomerOrdersById(customerId)
		// 			.then((response) => {
		// 				return response.data
		// 			})
		// 	} catch (error) {
		// 		this.error = error
		// 		return false;
		// 	} finally {
		// 		this.loading = false
		// 		return true;
		// 	}
		// },
	}
})