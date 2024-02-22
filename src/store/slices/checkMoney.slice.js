import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';
import { setIsLoading } from './isLoading.slice';
import getConfig from "../../utils/getConfig";

const URL_BASE = resources.URL_BASE;

export const checkMoneySlice = createSlice({
    name: 'checkMoney',
    initialState: [],
    reducers: {
        setCheckMoney: (state, action) => {
            return action.payload;
        }
    }
})

export const { setCheckMoney } = checkMoneySlice.actions;


export const getCheckMoneyThunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/check-money/all`, getConfig())
        .then((res) => dispatch(setCheckMoney(res.data.result)))
        .catch(err => {
            dispatch(setErrorReceived(err.response));
            alert("error al cargar ")
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const postCheckMoneyThunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/check-money/new`, data, getConfig())
        .then((res) => dispatch(getCheckMoneyThunk()))
        .catch(err => {
            dispatch(setErrorReceived(err.response));
            alert("error al crear")
        })
        .finally(() => dispatch(setIsLoading(false)));
}
export const updateCheckMoneyThunk = (id, data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/check-money/${id}/update`, data, getConfig())
        .then((res) => dispatch(getCheckMoneyThunk()))
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
            alert("error al actualizar")
        })
        .finally(() => dispatch(setIsLoading(false)));
}
export const deleteCheckMoneyThunk = (id) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/check-money/${id}/del`, getConfig())
        .then((res) => dispatch(getCheckMoneyThunk()))
        .catch(err => {
            dispatch(setErrorReceived(err.response));
            alert("error al delete")
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export default checkMoneySlice.reducer;
