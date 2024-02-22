import { createSlice } from "@reduxjs/toolkit";
import { setIsLoading } from "./isLoading.slice";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from "./errorReceived.slice";

const URL_BASE = resources.URL_BASE;

export const customerSlice = createSlice({
	name: "customer",
	initialState: [],
	reducers: {
		setCustomer: (state, action) => {
			return action.payload;
		},
	},
});

export const getCustomerThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	axios.get(`${URL_BASE}/api/v1/customer/all`, getConfig())
		.then((res) => {
			dispatch(setCustomer(res.data.result));
			// console.log('Recibe informacion');
		})
		.catch((err) => {
			// console.log("error en Customer get slice");
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const postCustomerthunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/customer/new`, data, getConfig())
		.then((res) => {
			dispatch(getCustomerThunk());
		})
		.catch((err) => {
			//   console.log(err?.response.data)
			if (
				err?.response.data.error ===
				"llave duplicada viola restricción de unicidad «clients_dni_key»"
			) {
				dispatch(
					setErrorReceived({
						error: "Este Cliente ya existe en la BASE DE DATOS revisa la lista de clientes.",
					})
				);
			} else {
				dispatch(setErrorReceived(err?.response.data));
			}
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const postCustomerClousterthunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/customer/newClouster`, data, getConfig())
		.then((res) => {
			dispatch(getCustomerThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err?.response.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updateCustomerThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/customer/${id}/update`, data, getConfig())
		.then((res) => {
			dispatch(getCustomerThunk());
		})
		.catch((err) => {
			alert(`No Se actualizo el Cliente`);
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deleteCustomerThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/customer/${id}/del`, getConfig())
		.then((res) => {
			dispatch(getCustomerThunk());
		})
		.catch((err) => {
			alert(`No Se pudo eliminar el CLiente`);
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const { setCustomer } = customerSlice.actions;

export default customerSlice.reducer;
