import { createSlice } from "@reduxjs/toolkit";
import { setIsLoading } from "./isLoading.slice";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from "./errorReceived.slice";
import { setTransaccion } from "./transaccion.slice";

const URL_BASE = resources.URL_BASE;

export const invoiceSlice = createSlice({
	name: "invoice",
	initialState: [],
	reducers: {
		setInvoice: (state, action) => {
			return action.payload;
		},
	},
});

export const { setInvoice } = invoiceSlice.actions;

export const getInvoiceThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	axios.get(`${URL_BASE}/api/v1/invoice/all`, getConfig())
		.then((res) => {
			dispatch(setInvoice(res.data.result));
			console.log(res.data.result);
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			//console.log(err.response);
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const getInvoiceSearchFilterThunk = (data) => (dispatch) => {
	const {
		id_client,
		id_seller,
		num_bill,
		date_init,
		date_end,
		balance,
		day_start,
	} = data;
	dispatch(setIsLoading(true));
	axios.get(
		`${URL_BASE}/api/v1/invoice/search?client=${id_client}&numBill=${num_bill}&dateInit=${date_init}&dateEnd=${date_end}&seller=${id_seller}&balance=${balance}&day_start=${day_start}`,
		getConfig()
	)
		.then((res) => {
			dispatch(setInvoice(res.data.result));
			// console.log("Recibe Peticion Get invoice");
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// console.log("Error en Slice invoice");
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const postInvoicethunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/invoice/new`, data, getConfig())
		.then(() => {
			dispatch(getInvoiceThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const postInvoiceTransacthunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/invoice/new`, data, getConfig())
		.then((res) => {
			dispatch(getInvoiceThunk());
			dispatch(setTransaccion(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updateInvoiceThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/invoice/${id}/update`, data, getConfig())
		.then((res) => {
			dispatch(getInvoiceThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deleteInvoiceThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/invoice/${id}/del`, getConfig())
		.then((res) => {
			dispatch(getInvoiceThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};
export default invoiceSlice.reducer;
