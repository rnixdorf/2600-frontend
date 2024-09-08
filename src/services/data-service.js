import http from "./http-common";

class DataService {
	getAllCustomers(params) {
		return http.post("/customers", params);
	}
	getCustomerById(customerId) {
		return http.get(`/customer/${customerId}`);
	}
	updateCustomer(customerId, data) {
		return http.post(`/customer/${customerId}`, data);
	}

	updateCustomerAddress(customerId, data) {
		return http.post(`/customerAddress/${customerId}`, data);
	}

	getCustomerOrdersById(customerId) {
		return http.get(`/customerOrders/${customerId}`);
	}

	updateDbWithIncomingOrders() {
		return http.get(`/updateDbWithIncomingOrders`);
	}

	getIncomingOrderById(orderId) {
		return http.get(`/order/${orderId}`);
	}

	getAllDistributors() {
		return http.get("/distributors");
	}

	getCustomerSubscriptionsById(customerId) {
		return http.get(`/customerSubscriptions/${customerId}`);
	}



	getAllHopeTickets(type_id) {
		return http.get(`/hopeTickets/${type_id}`);
	}
	getHopeById(hope_id) {
		// console.log("getCustomerById customerId", customerId);
		return http.get(`/hopeTicket/${hope_id}`);
	}
	updateHope(hope_id, data) {
		return http.post(`/hopeTicket/${hope_id}`, data);
	}
}

export default new DataService();
