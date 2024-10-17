import http from "./http-common";

class DataService {
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
