import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';

const URL_BASE = resources.URL_BASE;

export const routeDaySlice = createSlice({
    name: 'routeDay',
    initialState: [],
    reducers: {
        setRouteDay: (state, action) => {
            return action.payload;
        }

    }
})

export const { setRouteDay } = routeDaySlice.actions;

export const getRouteDayThunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/route-day/all`, getConfig())
        .then((res) => {
            dispatch(setRouteDay(res.data.result));
            // //console.log(res.data.result);
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const newRouteDayThunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/route-day/new`, data, getConfig())
        .then((res) => {
            dispatch(getRouteDayThunk());
            //console.log(res.data.result);
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const upRouteDayThunk = (id, data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.put(`${URL_BASE}/api/v1/route-day/${id}/update`, data, getConfig())
        .then((res) => {
            dispatch(getRouteDayThunk());
            //console.log(res.data.result);
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
}

export const delRouteDayThunk = (id) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.delete(`${URL_BASE}/api/v1/route-day/${id}/del`, getConfig())
        .then((res) => {
            dispatch(getRouteDayThunk());
            //console.log(res.data.result);
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
}



export default routeDaySlice.reducer;
