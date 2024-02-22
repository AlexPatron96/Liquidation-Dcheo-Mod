import { createSlice } from "@reduxjs/toolkit";
import { setIsLoading } from "./isLoading.slice";
import axios from "axios";
import resources from "../../utils/resources";
import { setErrorReceived } from "./errorReceived.slice";
const URL_BASE = resources.URL_BASE;

export const userLogedSlice = createSlice({
	name: "userLoged",
	initialState: [],
	reducers: {
		setUserLoged: (state, action) => {
			return action.payload;
		},
	},
});

export const setUserThunk = (data) => (dispatch) => {
	dispatch(setIsLoading(true));
	return axios
		.post(`${URL_BASE}/api/v1/auth/login`, data)
		.then((res) => {
			//console.log(res);
			dispatch(setUserLoged(res.data.data));
			localStorage.setItem(
				"userLiquidation",
				JSON.stringify(res.data.data)
			);
			localStorage.setItem("tokenLiquidation", res.data.data.token);
			// localStorage.setItem('logged_in', JSON.stringify(true))
		})
		.catch((err) => {
			//	console.log(err.response);
			// dispatch(setErrorReceived(err.response?.data));
			if (err.response?.status === 404 || err.response?.status === 400) {
				dispatch(setUserLoged(err?.response?.data));
			}
		})
		.finally(() => dispatch(setIsLoading(false)));
};

export const { setUserLoged } = userLogedSlice.actions;

export default userLogedSlice.reducer;
