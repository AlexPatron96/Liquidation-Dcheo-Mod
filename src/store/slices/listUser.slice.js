import { createSlice } from "@reduxjs/toolkit";
import { setIsLoading } from "./isLoading.slice";
import axios from "axios";
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from "./errorReceived.slice";
import { setDataTemp } from "./dataTemp.slice";

const URL_BASE = resources.URL_BASE;

export const listUser = createSlice({
	name: "listUser",
	initialState: [],
	reducers: {
		setListUser: (state, action) => {
			return action.payload;
		},
	},
});

export const { setListUser } = listUser.actions;

export const listUserThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.get(`${URL_BASE}/api/v1/auth/register/users`, getConfig())
		.then((res) => {
			dispatch(setListUser(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// dispatch(setUserLoged(err?.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const createUserThunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/auth/register`, data, getConfig())
		.then((res) => {
			// localStorage.clear();
			dispatch(listUserThunk());
		})
		.catch((err) => {
			if (err.response?.status === 404 || err.response?.status === 400) {
				dispatch(setErrorReceived(err.response?.data));
				// dispatch(setUserLoged(err?.response?.data));
			}
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updateUserThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/auth/user/${id}/update`, data, getConfig())
		.then((res) => {
			dispatch(listUserThunk());
		})
		.catch((err) => {
			if (err.response?.status === 404 || err.response?.status === 400) {
				dispatch(setErrorReceived(err.response?.data));
				// dispatch(setUserLoged(err?.response?.data));
			}
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deleteUserThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/auth/user/${id}/del`, getConfig())
		.then((res) => {
			dispatch(listUserThunk());
		})
		.catch((err) => {
			if (err.response?.status === 404 || err.response?.status === 400) {
				dispatch(setErrorReceived(err.response?.data));
				// dispatch(setUserLoged(err?.response?.data));
			}
		})
		.finally(() => dispatch(setIsLoading(false)));
};

/*********** Rolling   *********/
export const createRollThunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/roll/new`, data, getConfig())
		.then((res) => {
			dispatch(listRollThunk());
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const listTempRollThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.get(`${URL_BASE}/api/v1/roll/all`, getConfig())
		.then((res) => {
			dispatch(setDataTemp(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// dispatch(setUserLoged(err?.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const listRollThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.get(`${URL_BASE}/api/v1/roll/all`, getConfig())
		.then((res) => {
			dispatch(setListUser(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// dispatch(setUserLoged(err?.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updateRollThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/roll/${id}/update`, data, getConfig())
		.then((res) => {
			dispatch(listRollThunk(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// dispatch(setUserLoged(err?.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deleteRollThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/roll/${id}/del`, getConfig())
		.then((res) => {
			dispatch(listRollThunk(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
			// dispatch(setUserLoged(err?.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

/*********** Permissions   *********/
export const listPermissionsThunk = () => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.get(`${URL_BASE}/api/v1/permissions/all`, getConfig())
		.then((res) => {
			dispatch(setDataTemp(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const createPermissionsThunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/permissions/new`, data, getConfig())
		.then((res) => {
			dispatch(listPermissionsThunk(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const updatePermissionsThunk = (id, data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.put(`${URL_BASE}/api/v1/permissions/${id}/update`, data, getConfig())
		.then((res) => {
			dispatch(listPermissionsThunk(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const deletePermissionsThunk = (id) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.delete(`${URL_BASE}/api/v1/permissions/${id}/del`, getConfig())
		.then((res) => {
			dispatch(listPermissionsThunk(res.data.result));
		})
		.catch((err) => {
			dispatch(setErrorReceived(err.response?.data));
		})
		.finally(() => dispatch(setIsLoading(false)));
};
export default listUser.reducer;
