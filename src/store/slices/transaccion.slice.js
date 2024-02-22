import { createSlice } from "@reduxjs/toolkit";
import { setIsLoading } from "./isLoading.slice";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from "./errorReceived.slice";
import { getInvoiceThunk } from "./invoice.slice";

const URL_BASE = resources.URL_BASE;

export const transacionSlice = createSlice({
	name: "transaction",
	initialState: [],
	reducers: {
		setTransaccion: (state, action) => {
			return action.payload;
		},
	},
});

export const { setTransaccion } = transacionSlice.actions;

export default transacionSlice.reducer;

export const getTransactionThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.get(`${URL_BASE}/api/v1/payments/all`, getConfig())
		.then((res) => {
			dispatch(setTransaccion(res.data.result));
			//console.log("Recibe peticion transaction");
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			alert("error all Transaction");
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const postTransactionthunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	//console.log(data);
	return axios
		.post(`${URL_BASE}/api/v1/payments/new`, data, getConfig())
		.then(() => {
			dispatch(getTransactionThunk());
			dispatch(getInvoiceThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			alert("error new Transaction");
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updateTransactionThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/payments/${id}/update`, data, getConfig())
		.then(() => {
			dispatch(getTransactionThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response.data));
			alert(`error update transaction`);
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const delUpdateTransactionThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/payments/${id}/delete-update`, getConfig())
		.then((res) => {
			//console.log(res.data);
			dispatch(getTransactionThunk());
			dispatch(getInvoiceThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response.data));
			alert(`error update transaction`);
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deleteTransactionThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/payments/${id}/del`, getConfig())
		.then(() => {
			dispatch(getTransactionThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response.data));
			alert(`error delete transaction`);
		})
		.finally(() => dispatch(setIsLoading(false)));
};
