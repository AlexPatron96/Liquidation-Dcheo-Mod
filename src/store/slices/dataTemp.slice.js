import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';
import { setIsLoading } from './isLoading.slice';
import getConfig from "../../utils/getConfig";

const URL_BASE = resources.URL_BASE;

export const dataTempSlice = createSlice({
    name: 'temporary',
    initialState: [],
    reducers: {
        setDataTemp: (state, action) => {
            return action.payload;
        },
    }
})

export const getRoutethunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/route/all`, getConfig())
        .then((res) => dispatch(setDataTemp(res.data.result)))
        .catch(err => {
            dispatch(setErrorReceived(err.response));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const newRoutethunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/route/new`, data, getConfig())
        .then((res) => {
            // console.log(res.data.message);
            dispatch(getRoutethunk());
        })
        .catch(err => {
            // console.log("error en temp slice");
            dispatch(setErrorReceived(err.response));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const deleteRoutethunk = (id) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.delete(`${URL_BASE}/api/v1/route/${id}/del`, getConfig())
        .then((res) => {
            dispatch(getRoutethunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const updateRoutethunk = (id, data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.put(`${URL_BASE}/api/v1/route/${id}/update`, data, getConfig())
        .then((res) => {
            dispatch(getRoutethunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const { setDataTemp } = dataTempSlice.actions;

export default dataTempSlice.reducer;
