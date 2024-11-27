import http from "./http-common";

class DataService {
	/********Setting********************************************** */
	getSettings() {
		return http.get("/settings");
	}
	updateSettings(data) {
		return http.post(`/settings`, data);
	}
	/********Customers********************************************** */
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

	/********Orders********************************************** */
	getSubscriptionTypes() {
		return http.get("/subscriptionTypes");
	}
	
	getCustomerOrdersById(customerId) {
		return http.get(`/customerOrders/${customerId}`);
	}

	getZipCount(zip) {
		return http.get(`/zipCount/${zip}`);
	}

	updateDbWithIncomingOrders() {
		return http.get(`/updateDbWithIncomingOrders`);
	}

	getIncomingOrderById(orderId) {
		return http.get(`/order/${orderId}`);
	}

	insertCustomerOrder(data) {
		return http.post(`/customerOrders`, data);
	}

	/********Distributors********************************************** */
	getAllDistributors() {
		return http.get("/distributors");
	}

	/********Subscriptions********************************************** */
	getCustomerSubscriptionsById(customerId) {
		return http.get(`/customerSubscriptions/${customerId}`);
	}

	updateSubscription(subscriptionId, data) {
		return http.post(`/customerSubscriptions/${subscriptionId}`, data);
	}

	/********Batches********************************************** */
	getCurrentBatch() {
		return http.get(`/currentBatch`);
	}

	/********HOPE********************************************** */
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
